use anchor_lang::prelude::*;

declare_id!("5rPjuKt8N2MM9b2EHbU9MbHCC3SdQrmy2K7uneFJ1g1A");

// disc(8) + authority(32) + agent_id(4+32) + name(4+64) +
// specialization(4+32) + agent_type(1) + reputation_score(8) +
// total_sessions(8) + total_attestations(8) + created_at(8) +
// is_active(1) + bump(1) = 215
pub const AGENT_ACCOUNT_SIZE: usize = 215;

pub const AGENT_TYPE_MARKETPLACE: u8 = 0;
pub const AGENT_TYPE_BLOCKBRAIN: u8 = 1;

// Only reputation-attestation (Gyu1z…) may call update_reputation.
// We validate by deriving the expected [b"rep_auth"] PDA from this program ID
// and requiring the caller to present that PDA as a signer.
pub const REPUTATION_ATTESTATION_ID: Pubkey = Pubkey::new_from_array([
    237, 114, 165, 36, 21, 100, 131, 6, 38, 141, 93, 39, 60, 159, 143, 224,
    133, 223, 164, 135, 157, 99, 48, 143, 63, 106, 201, 241, 0, 154, 169, 91,
]);

// ──────────────────────────────────────────────────────────────
#[program]
pub mod agent_registry {
    use super::*;

    /// Register a new agent on-chain. Creates a PDA keyed by agent_id.
    pub fn register_agent(
        ctx: Context<RegisterAgent>,
        agent_id: String,
        name: String,
        specialization: String,
        agent_type: u8,
    ) -> Result<()> {
        require!(agent_id.len() <= 32, FieldSyncError::StringTooLong);
        require!(name.len() <= 64, FieldSyncError::StringTooLong);
        require!(specialization.len() <= 32, FieldSyncError::StringTooLong);
        require!(
            agent_type == AGENT_TYPE_MARKETPLACE || agent_type == AGENT_TYPE_BLOCKBRAIN,
            FieldSyncError::InvalidAgentType
        );

        let agent = &mut ctx.accounts.agent;
        agent.authority = ctx.accounts.authority.key();
        agent.agent_id = agent_id;
        agent.name = name;
        agent.specialization = specialization;
        agent.agent_type = agent_type;
        agent.reputation_score = 0;
        agent.total_sessions = 0;
        agent.total_attestations = 0;
        agent.created_at = Clock::get()?.unix_timestamp;
        agent.is_active = true;
        agent.bump = ctx.bumps.agent;

        msg!("Agent registered: {} (type={})", agent.name, agent_type);
        Ok(())
    }

    /// Activate or deactivate an agent. Only the registered authority can call this.
    pub fn update_agent_status(ctx: Context<UpdateAgentStatus>, is_active: bool) -> Result<()> {
        ctx.accounts.agent.is_active = is_active;
        msg!("Agent {} is_active={}", ctx.accounts.agent.agent_id, is_active);
        Ok(())
    }

    /// Increment session counter after a session starts.
    pub fn increment_sessions(ctx: Context<IncrementSessions>) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.total_sessions = agent
            .total_sessions
            .checked_add(1)
            .ok_or(FieldSyncError::Overflow)?;
        Ok(())
    }

    /// Update reputation score via CPI from reputation-attestation only.
    /// Security: caller_authority must be the [b"rep_auth"] PDA of REPUTATION_ATTESTATION_ID.
    /// Because PDA addresses are unique per program, only reputation-attestation can produce
    /// a signer that satisfies this check.
    pub fn update_reputation(
        ctx: Context<UpdateReputation>,
        _agent_id: String,
        rating: u8,
    ) -> Result<()> {
        require!(rating >= 1 && rating <= 5, FieldSyncError::InvalidRating);

        let (expected_authority, _) =
            Pubkey::find_program_address(&[b"rep_auth"], &REPUTATION_ATTESTATION_ID);
        require!(
            ctx.accounts.caller_authority.key() == expected_authority,
            FieldSyncError::Unauthorized
        );

        let agent = &mut ctx.accounts.agent;
        require!(agent.is_active, FieldSyncError::AgentNotActive);

        agent.reputation_score = agent
            .reputation_score
            .checked_add(
                (rating as u64)
                    .checked_mul(100)
                    .ok_or(FieldSyncError::Overflow)?,
            )
            .ok_or(FieldSyncError::Overflow)?;

        agent.total_attestations = agent
            .total_attestations
            .checked_add(1)
            .ok_or(FieldSyncError::Overflow)?;

        msg!(
            "Reputation updated: agent={} score={} attestations={}",
            agent.agent_id,
            agent.reputation_score,
            agent.total_attestations
        );
        Ok(())
    }
}

// ──────────────────────────────────────────────────────────────
// Account contexts

#[derive(Accounts)]
#[instruction(agent_id: String)]
pub struct RegisterAgent<'info> {
    #[account(
        init,
        payer = authority,
        space = AGENT_ACCOUNT_SIZE,
        seeds = [b"agent", agent_id.as_bytes()],
        bump
    )]
    pub agent: Account<'info, AgentAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgentStatus<'info> {
    #[account(
        mut,
        seeds = [b"agent", agent.agent_id.as_bytes()],
        bump = agent.bump,
        has_one = authority @ FieldSyncError::Unauthorized,
    )]
    pub agent: Account<'info, AgentAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct IncrementSessions<'info> {
    #[account(
        mut,
        seeds = [b"agent", agent.agent_id.as_bytes()],
        bump = agent.bump,
        constraint = agent.is_active @ FieldSyncError::AgentNotActive,
    )]
    pub agent: Account<'info, AgentAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(agent_id: String)]
pub struct UpdateReputation<'info> {
    #[account(
        mut,
        seeds = [b"agent", agent_id.as_bytes()],
        bump = agent.bump,
    )]
    pub agent: Account<'info, AgentAccount>,
    /// CHECK: Validated in instruction body — must equal find_pda([b"rep_auth"], REPUTATION_ATTESTATION_ID)
    pub caller_authority: UncheckedAccount<'info>,
}

// ──────────────────────────────────────────────────────────────
// Account data

#[account]
pub struct AgentAccount {
    pub authority: Pubkey,        // 32
    pub agent_id: String,         // 4 + 32
    pub name: String,             // 4 + 64
    pub specialization: String,   // 4 + 32
    pub agent_type: u8,           // 1  (0=marketplace, 1=blockbrain)
    pub reputation_score: u64,    // 8  cumulative: sum of (rating × 100)
    pub total_sessions: u64,      // 8
    pub total_attestations: u64,  // 8
    pub created_at: i64,          // 8
    pub is_active: bool,          // 1
    pub bump: u8,                 // 1
}

// ──────────────────────────────────────────────────────────────
// Errors

#[error_code]
pub enum FieldSyncError {
    #[msg("String exceeds maximum length")]
    StringTooLong,
    #[msg("Invalid agent type — must be 0 (marketplace) or 1 (blockbrain)")]
    InvalidAgentType,
    #[msg("Rating must be between 1 and 5")]
    InvalidRating,
    #[msg("Agent is not active")]
    AgentNotActive,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Caller is not authorized")]
    Unauthorized,
}
