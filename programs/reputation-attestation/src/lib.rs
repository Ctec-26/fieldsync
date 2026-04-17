use anchor_lang::prelude::*;

declare_id!("Gyu1zPoU2BXAfxAsCnQX2kgk4ktW8n7mBsjRALdaWEPt");

// disc(8) + attester(32) + agent_id(4+32) + session_id(4+64) +
// rating(1) + comment_hash(32) + timestamp(8) + agent_type(1) + bump(1) = 187
pub const ATTESTATION_ACCOUNT_SIZE: usize = 187;

// ──────────────────────────────────────────────────────────────
#[program]
pub mod reputation_attestation {
    use super::*;

    /// Submit an on-chain attestation after a session completes.
    /// Creates the attestation PDA, then CPIs to agent-registry to update reputation.
    /// PDA uniqueness (attester + session_id) prevents duplicate attestations.
    ///
    /// comment_hash: SHA-256 of the comment text — computed on the client, only the
    /// proof lives on-chain. This avoids storing potentially large strings on-chain.
    pub fn submit_attestation(
        ctx: Context<SubmitAttestation>,
        agent_id: String,
        session_id: String,
        rating: u8,
        comment_hash: [u8; 32],
        agent_type: u8,
    ) -> Result<()> {
        require!(agent_id.len() <= 32, AttestationError::StringTooLong);
        require!(session_id.len() <= 64, AttestationError::StringTooLong);
        require!(rating >= 1 && rating <= 5, AttestationError::InvalidRating);
        require!(
            agent_type == 0 || agent_type == 1,
            AttestationError::InvalidAgentType
        );

        let att = &mut ctx.accounts.attestation;
        att.attester = ctx.accounts.attester.key();
        att.agent_id = agent_id.clone();
        att.session_id = session_id;
        att.rating = rating;
        att.comment_hash = comment_hash;
        att.timestamp = Clock::get()?.unix_timestamp;
        att.agent_type = agent_type;
        att.bump = ctx.bumps.attestation;

        // CPI to agent-registry: update reputation_score and total_attestations.
        // Sign with [b"rep_auth"] PDA so agent-registry can verify this caller.
        let bump = ctx.bumps.rep_authority;
        let signer_seeds: &[&[&[u8]]] = &[&[b"rep_auth", &[bump]]];

        agent_registry::cpi::update_reputation(
            CpiContext::new_with_signer(
                agent_registry::ID,
                agent_registry::cpi::accounts::UpdateReputation {
                    agent: ctx.accounts.agent.to_account_info(),
                    caller_authority: ctx.accounts.rep_authority.to_account_info(),
                },
                signer_seeds,
            ),
            agent_id,
            rating,
        )?;

        msg!(
            "Attestation: session={} rating={} type={}",
            att.session_id,
            rating,
            agent_type
        );
        Ok(())
    }
}

// ──────────────────────────────────────────────────────────────
// Account contexts

#[derive(Accounts)]
#[instruction(agent_id: String, session_id: String)]
pub struct SubmitAttestation<'info> {
    /// One attestation per (attester, session_id) — enforced by PDA seed uniqueness.
    #[account(
        init,
        payer = attester,
        space = ATTESTATION_ACCOUNT_SIZE,
        seeds = [b"attestation", session_id.as_bytes(), attester.key().as_ref()],
        bump
    )]
    pub attestation: Account<'info, AttestationAccount>,

    #[account(mut)]
    pub attester: Signer<'info>,

    /// The agent account in agent-registry that will have its reputation updated.
    /// CHECK: Validated inside agent_registry::update_reputation via PDA seeds.
    #[account(mut)]
    pub agent: UncheckedAccount<'info>,

    /// This program's authority PDA used to sign the CPI to agent-registry.
    /// agent-registry validates: key == find_pda([b"rep_auth"], reputation_attestation::ID)
    /// Only this program can produce this signer since PDAs are unique per program.
    #[account(
        seeds = [b"rep_auth"],
        bump
    )]
    pub rep_authority: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

// ──────────────────────────────────────────────────────────────
// Account data

#[account]
pub struct AttestationAccount {
    pub attester: Pubkey,        // 32
    pub agent_id: String,        // 4 + 32
    pub session_id: String,      // 4 + 64
    pub rating: u8,              // 1
    pub comment_hash: [u8; 32],  // 32 — SHA-256 of comment text (computed client-side)
    pub timestamp: i64,          // 8
    pub agent_type: u8,          // 1  (0=marketplace, 1=blockbrain)
    pub bump: u8,                // 1
}

// ──────────────────────────────────────────────────────────────
// Errors

#[error_code]
pub enum AttestationError {
    #[msg("String exceeds maximum length")]
    StringTooLong,
    #[msg("Rating must be between 1 and 5")]
    InvalidRating,
    #[msg("Invalid agent type — must be 0 or 1")]
    InvalidAgentType,
}
