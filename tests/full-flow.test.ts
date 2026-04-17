/**
 * Full end-to-end integration test covering the complete FieldSync flow:
 *
 * 1. Register 3 Marketplace agents + 3 BlockBrain educator agents
 * 2. Pay for a marketplace session (0.05 SOL)
 * 3. Consume the session
 * 4. Submit attestation → verify reputation updated via CPI
 * 5. Verify BlockBrain attestation works without payment
 */
import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createHash } from "crypto";
import { expect } from "chai";
import type { AgentRegistry } from "../target/types/agent_registry";
import type { ReputationAttestation } from "../target/types/reputation_attestation";
import type { SessionPayment } from "../target/types/session_payment";

describe("full-flow — FieldSync Phase 2 integration", () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);

  const registryProgram = anchor.workspace.AgentRegistry as Program<AgentRegistry>;
  const attestProgram = anchor.workspace.ReputationAttestation as Program<ReputationAttestation>;
  const paymentProgram = anchor.workspace.SessionPayment as Program<SessionPayment>;
  const authority = provider.wallet as anchor.Wallet;

  const agentAuthority = Keypair.generate();

  function agentPda(agentId: string): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("agent"), Buffer.from(agentId)],
      registryProgram.programId
    )[0];
  }

  function repAuthorityPda(): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("rep_auth")],
      attestProgram.programId
    )[0];
  }

  function attestationPda(sessionId: string, attester: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), Buffer.from(sessionId), attester.toBuffer()],
      attestProgram.programId
    )[0];
  }

  function paymentPda(sessionId: string, payer: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("payment"), Buffer.from(sessionId), payer.toBuffer()],
      paymentProgram.programId
    )[0];
  }

  function sha256(text: string): number[] {
    return Array.from(createHash("sha256").update(text).digest());
  }

  before(async () => {
    // Fund the agent authority that receives session payments
    const sig = await provider.connection.requestAirdrop(agentAuthority.publicKey, 1 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(sig);
  });

  // ── Step 1: Register all 6 launch agents ─────────────────────

  const LAUNCH_AGENTS = [
    // Marketplace agents (type=0)
    { id: "rwa-agent-v1",    name: "RWA Agent",            spec: "rwa",          type: 0 },
    { id: "defi-agent-v1",   name: "DeFi Agent",           spec: "defi",         type: 0 },
    { id: "x402-agent-v1",   name: "x402 Agent",           spec: "x402",         type: 0 },
    // BlockBrain educator agents (type=1)
    { id: "edu-rwa-v1",      name: "Educator RWA Agent",   spec: "educator-rwa",  type: 1 },
    { id: "edu-defi-v1",     name: "Educator DeFi Agent",  spec: "educator-defi", type: 1 },
    { id: "edu-x402-v1",     name: "Educator x402 Agent",  spec: "educator-x402", type: 1 },
  ] as const;

  for (const agent of LAUNCH_AGENTS) {
    it(`registers ${agent.name} (type=${agent.type})`, async () => {
      const agentPubkey = agentPda(agent.id);

      // Skip if already registered from a previous test run
      try {
        await registryProgram.account.agentAccount.fetch(agentPubkey);
        return; // already exists, pass
      } catch {}

      await registryProgram.methods
        .registerAgent(agent.id, agent.name, agent.spec, agent.type)
        .accounts({
          agent: agentPubkey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      const account = await registryProgram.account.agentAccount.fetch(agentPubkey);
      expect(account.agentId).to.equal(agent.id);
      expect(account.agentType).to.equal(agent.type);
      expect(account.isActive).to.be.true;
    });
  }

  // ── Step 2: Pay for a marketplace session ────────────────────

  let paidSessionId: string;

  it("pays 0.05 SOL for an RWA marketplace session", async () => {
    paidSessionId = `sess-full-flow-${Date.now()}`;
    const paymentPubkey = paymentPda(paidSessionId, authority.publicKey);

    const balanceBefore = await provider.connection.getBalance(agentAuthority.publicKey);

    await paymentProgram.methods
      .payForSession("rwa-agent-v1", paidSessionId)
      .accounts({
        payment: paymentPubkey,
        payer: authority.publicKey,
        agentAuthority: agentAuthority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const payment = await paymentProgram.account.sessionPaymentAccount.fetch(paymentPubkey);
    expect(payment.amountLamports.toNumber()).to.equal(0.05 * LAMPORTS_PER_SOL);
    expect(payment.isConsumed).to.be.false;

    const balanceAfter = await provider.connection.getBalance(agentAuthority.publicKey);
    expect(balanceAfter - balanceBefore).to.equal(0.05 * LAMPORTS_PER_SOL);
  });

  // ── Step 3: Consume the session (user enters chat) ───────────

  it("consumes the paid session", async () => {
    const paymentPubkey = paymentPda(paidSessionId, authority.publicKey);

    await paymentProgram.methods
      .consumeSession()
      .accounts({ payment: paymentPubkey, payer: authority.publicKey })
      .rpc();

    const payment = await paymentProgram.account.sessionPaymentAccount.fetch(paymentPubkey);
    expect(payment.isConsumed).to.be.true;
  });

  // ── Step 4: Submit attestation + verify CPI reputation update ─

  it("submits marketplace attestation and verifies reputation updated via CPI", async () => {
    const agentId = "rwa-agent-v1";
    const agentPubkey = agentPda(agentId);
    const attestPubkey = attestationPda(paidSessionId, authority.publicKey);
    const repAuth = repAuthorityPda();

    const agentBefore = await registryProgram.account.agentAccount.fetch(agentPubkey);

    await attestProgram.methods
      .submitAttestation(
        agentId,
        paidSessionId,
        5,
        sha256("Best RWA explanation I've ever had. Clear, concise, on-chain."),
        0 // marketplace
      )
      .accounts({
        attestation: attestPubkey,
        attester: authority.publicKey,
        agent: agentPubkey,
        repAuthority: repAuth,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: registryProgram.programId, isSigner: false, isWritable: false },
      ])
      .rpc();

    // Verify attestation was recorded
    const att = await attestProgram.account.attestationAccount.fetch(attestPubkey);
    expect(att.rating).to.equal(5);
    expect(att.agentType).to.equal(0);

    // Verify CPI updated the registry — reputation_score += rating * 100
    const agentAfter = await registryProgram.account.agentAccount.fetch(agentPubkey);
    expect(agentAfter.reputationScore.toNumber()).to.equal(
      agentBefore.reputationScore.toNumber() + 5 * 100
    );
    expect(agentAfter.totalAttestations.toNumber()).to.equal(
      agentBefore.totalAttestations.toNumber() + 1
    );
  });

  // ── Step 5: BlockBrain attestation (free, no payment) ────────

  it("submits BlockBrain attestation without payment — free flow confirmed", async () => {
    const agentId = "edu-rwa-v1";
    const sessionId = `bb-sess-${Date.now()}`;
    const agentPubkey = agentPda(agentId);
    const attestPubkey = attestationPda(sessionId, authority.publicKey);
    const repAuth = repAuthorityPda();

    const agentBefore = await registryProgram.account.agentAccount.fetch(agentPubkey);

    // NOTE: No SessionPayment call before this — BlockBrain is free
    await attestProgram.methods
      .submitAttestation(
        agentId,
        sessionId,
        4,
        sha256("Great free educator agent. Explained RWA in plain English."),
        1 // blockbrain
      )
      .accounts({
        attestation: attestPubkey,
        attester: authority.publicKey,
        agent: agentPubkey,
        repAuthority: repAuth,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([
        { pubkey: registryProgram.programId, isSigner: false, isWritable: false },
      ])
      .rpc();

    const att = await attestProgram.account.attestationAccount.fetch(attestPubkey);
    expect(att.agentType).to.equal(1);
    expect(att.rating).to.equal(4);

    const agentAfter = await registryProgram.account.agentAccount.fetch(agentPubkey);
    expect(agentAfter.reputationScore.toNumber()).to.equal(
      agentBefore.reputationScore.toNumber() + 4 * 100
    );
  });

  // ── Final: Verify combined on-chain state ────────────────────

  it("verifies final on-chain state of all 6 agents", async () => {
    for (const agent of LAUNCH_AGENTS) {
      const account = await registryProgram.account.agentAccount.fetch(agentPda(agent.id));
      expect(account.isActive, `${agent.id} should be active`).to.be.true;
      expect(account.agentType, `${agent.id} type`).to.equal(agent.type);
    }
  });
});
