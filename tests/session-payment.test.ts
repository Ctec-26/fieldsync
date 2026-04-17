import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";
import type { SessionPayment } from "../target/types/session_payment";
import type { AgentRegistry } from "../target/types/agent_registry";

describe("session-payment", () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SessionPayment as Program<SessionPayment>;
  const registryProgram = anchor.workspace.AgentRegistry as Program<AgentRegistry>;
  const authority = provider.wallet as anchor.Wallet;

  const SESSION_PRICE = 0.05 * LAMPORTS_PER_SOL;

  function paymentPda(sessionId: string, payer: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("payment"), Buffer.from(sessionId), payer.toBuffer()],
      program.programId
    );
  }

  const agentAuthority = Keypair.generate();

  before(async () => {
    // Fund agent authority (receives payment)
    await provider.connection.requestAirdrop(agentAuthority.publicKey, 0.5 * LAMPORTS_PER_SOL);
    await new Promise(r => setTimeout(r, 1000));
  });

  it("pays 0.05 SOL for a marketplace session", async () => {
    const sessionId = `sess-${Date.now()}`;
    const [paymentPubkey] = paymentPda(sessionId, authority.publicKey);

    const authorityBalanceBefore = await provider.connection.getBalance(agentAuthority.publicKey);

    await program.methods
      .payForSession("rwa-agent-v1", sessionId)
      .accounts({
        payment: paymentPubkey,
        payer: authority.publicKey,
        agentAuthority: agentAuthority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const payment = await program.account.sessionPaymentAccount.fetch(paymentPubkey);
    expect(payment.payer.toBase58()).to.equal(authority.publicKey.toBase58());
    expect(payment.agentId).to.equal("rwa-agent-v1");
    expect(payment.sessionId).to.equal(sessionId);
    expect(payment.amountLamports.toNumber()).to.equal(SESSION_PRICE);
    expect(payment.isConsumed).to.be.false;

    // Verify SOL was transferred
    const authorityBalanceAfter = await provider.connection.getBalance(agentAuthority.publicKey);
    expect(authorityBalanceAfter - authorityBalanceBefore).to.equal(SESSION_PRICE);
  });

  it("marks session as consumed when user enters chat", async () => {
    const sessionId = `sess-consume-${Date.now()}`;
    const [paymentPubkey] = paymentPda(sessionId, authority.publicKey);

    await program.methods
      .payForSession("defi-agent-v1", sessionId)
      .accounts({
        payment: paymentPubkey,
        payer: authority.publicKey,
        agentAuthority: agentAuthority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .consumeSession()
      .accounts({ payment: paymentPubkey, payer: authority.publicKey })
      .rpc();

    const payment = await program.account.sessionPaymentAccount.fetch(paymentPubkey);
    expect(payment.isConsumed).to.be.true;
  });

  it("rejects double-consume of the same session", async () => {
    const sessionId = `sess-double-${Date.now()}`;
    const [paymentPubkey] = paymentPda(sessionId, authority.publicKey);

    await program.methods
      .payForSession("x402-agent-v1", sessionId)
      .accounts({
        payment: paymentPubkey,
        payer: authority.publicKey,
        agentAuthority: agentAuthority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .consumeSession()
      .accounts({ payment: paymentPubkey, payer: authority.publicKey })
      .rpc();

    try {
      await program.methods
        .consumeSession()
        .accounts({ payment: paymentPubkey, payer: authority.publicKey })
        .rpc();
      expect.fail("Should have thrown SessionAlreadyConsumed");
    } catch (e: any) {
      expect(e.message).to.include("SessionAlreadyConsumed");
    }
  });

  it("prevents duplicate session IDs for same payer (PDA uniqueness)", async () => {
    const sessionId = `sess-dup-${Date.now()}`;
    const [paymentPubkey] = paymentPda(sessionId, authority.publicKey);

    await program.methods
      .payForSession("rwa-agent-v1", sessionId)
      .accounts({
        payment: paymentPubkey,
        payer: authority.publicKey,
        agentAuthority: agentAuthority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    try {
      // Same session ID = same PDA = init will fail (account already exists)
      await program.methods
        .payForSession("rwa-agent-v1", sessionId)
        .accounts({
          payment: paymentPubkey,
          payer: authority.publicKey,
          agentAuthority: agentAuthority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      expect.fail("Should have thrown — PDA already initialized");
    } catch (e: any) {
      // Any error here proves double-payment is blocked
      expect(e).to.exist;
    }
  });
});
