use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("8T4ituXHy6NgE41qd67v61Gnvx78Ln96AdhqjTpuY7CE");

// disc(8) + payer(32) + agent_id(4+32) + session_id(4+64) +
// amount_lamports(8) + paid_at(8) + is_consumed(1) + bump(1) = 162
pub const SESSION_PAYMENT_SIZE: usize = 162;

pub const SESSION_PRICE_LAMPORTS: u64 = 50_000_000; // 0.05 SOL

// ──────────────────────────────────────────────────────────────
#[program]
pub mod session_payment {
    use super::*;

    /// Transfer 0.05 SOL from payer to agent authority and record the payment on-chain.
    /// Marketplace-only — BlockBrain sessions skip this program entirely.
    pub fn pay_for_session(
        ctx: Context<PayForSession>,
        agent_id: String,
        session_id: String,
    ) -> Result<()> {
        require!(agent_id.len() <= 32, PaymentError::StringTooLong);
        require!(session_id.len() <= 64, PaymentError::StringTooLong);

        // Verify payer has enough lamports (rent-exempt minimum + payment + tx fee buffer)
        let payer_balance = ctx.accounts.payer.lamports();
        require!(
            payer_balance >= SESSION_PRICE_LAMPORTS.checked_add(5_000_000).ok_or(PaymentError::Overflow)?,
            PaymentError::InsufficientFunds
        );

        // Transfer SOL from payer to agent authority.
        // CpiContext::new takes program_id: Pubkey in anchor-lang 1.0.0.
        system_program::transfer(
            CpiContext::new(
                system_program::ID,
                system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.agent_authority.to_account_info(),
                },
            ),
            SESSION_PRICE_LAMPORTS,
        )?;

        let payment = &mut ctx.accounts.payment;
        payment.payer = ctx.accounts.payer.key();
        payment.agent_id = agent_id;
        payment.session_id = session_id;
        payment.amount_lamports = SESSION_PRICE_LAMPORTS;
        payment.paid_at = Clock::get()?.unix_timestamp;
        payment.is_consumed = false;
        payment.bump = ctx.bumps.payment;

        msg!(
            "Session paid: {} lamports → {} for agent={}",
            SESSION_PRICE_LAMPORTS,
            ctx.accounts.agent_authority.key(),
            payment.agent_id
        );
        Ok(())
    }

    /// Mark a paid session as started. Called when the user enters the chat.
    /// Prevents the same payment from being used to open multiple sessions.
    pub fn consume_session(ctx: Context<ConsumeSession>) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        require!(!payment.is_consumed, PaymentError::SessionAlreadyConsumed);
        require!(
            ctx.accounts.payer.key() == payment.payer,
            PaymentError::Unauthorized
        );
        payment.is_consumed = true;
        msg!("Session consumed: {}", payment.session_id);
        Ok(())
    }
}

// ──────────────────────────────────────────────────────────────
// Account contexts

#[derive(Accounts)]
#[instruction(agent_id: String, session_id: String)]
pub struct PayForSession<'info> {
    /// Payment PDA — unique per (session_id, payer), prevents double-payment.
    #[account(
        init,
        payer = payer,
        space = SESSION_PAYMENT_SIZE,
        seeds = [b"payment", session_id.as_bytes(), payer.key().as_ref()],
        bump
    )]
    pub payment: Account<'info, SessionPaymentAccount>,

    #[account(mut)]
    pub payer: Signer<'info>,

    /// Receives the 0.05 SOL payment — must be the registered agent authority.
    /// CHECK: The frontend passes the correct authority. On-chain agent validation
    /// is enforced at the application layer (agent-registry lookup before payment).
    #[account(mut)]
    pub agent_authority: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct ConsumeSession<'info> {
    #[account(
        mut,
        seeds = [b"payment", payment.session_id.as_bytes(), payer.key().as_ref()],
        bump = payment.bump,
    )]
    pub payment: Account<'info, SessionPaymentAccount>,
    pub payer: Signer<'info>,
}

// ──────────────────────────────────────────────────────────────
// Account data

#[account]
pub struct SessionPaymentAccount {
    pub payer: Pubkey,          // 32
    pub agent_id: String,       // 4 + 32
    pub session_id: String,     // 4 + 64
    pub amount_lamports: u64,   // 8
    pub paid_at: i64,           // 8
    pub is_consumed: bool,      // 1
    pub bump: u8,               // 1
}

// ──────────────────────────────────────────────────────────────
// Errors

#[error_code]
pub enum PaymentError {
    #[msg("String exceeds maximum length")]
    StringTooLong,
    #[msg("Insufficient SOL balance for session payment")]
    InsufficientFunds,
    #[msg("Session payment has already been consumed")]
    SessionAlreadyConsumed,
    #[msg("Caller is not authorized")]
    Unauthorized,
    #[msg("Arithmetic overflow")]
    Overflow,
}
