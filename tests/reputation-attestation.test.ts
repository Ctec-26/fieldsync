import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { createHash } from "crypto";
import { expect } from "chai";
import type { ReputationAttestation } from "../target/types/reputation_attestation";
import type { AgentRegistry } from "../target/types/agent_registry";

describe("reputation-attestation", () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);
  const attestProgram = anchor.workspace.ReputationAttestation as Program<ReputationAttestation>;
  const registryProgram = anchor.workspace.AgentRegistry as Program<AgentRegistry>;
  const authority = provider.wallet as anchor.Wallet;

  function agentPda(agentId: string): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("agent"), Buffer.from(agentId)],
      registryProgram.programId
    )[0];
  }

  function attestationPda(sessionId: string, attester: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("attestation"), Buffer.from(sessionId), attester.toBuffer()],
      attestProgram.programId
    )[0];
  }

  function repAuthorityPda(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("rep_auth")],
      attestProgram.programId
    );
  }

  function sha256(text: string): Buffer {
    return createHash("sha256").update(text).digest();
  }

  // Ensure agents exist before attestation tests
  before(async () => {
    for (const [agentId, name, spec, type] of [
      ["rwa-agent-v1", "RWA Agent", "rwa", 0],
      ["edu-rwa-v1", "Educator RWA Agent", "educator-rwa", 1],
    ] as const) {
      const agentPubkey = agentPda(agentId);
      try {
        await registryProgram.account.agentAccount.fetch(agentPubkey);
      } catch {
        await registryProgram.methods
          .registerAgent(agentId, name, spec, type as number)
          .accounts({ agent: agentPubkey, authority: authority.publicKey, systemProgram: SystemProgram.programId })
          .rpc();
      }
    }
  });

  // ── Marketplace attestation ─────────────────────────────────

  it("submits a marketplace attestation (type=0) and updates agent reputation", async () => {
    const agentId = "rwa-agent-v1";
    const sessionId = `sess-att-mkt-${Date.now()}`;
    const comment = "Excellent explanation of RWA tokenization.";
    const commentHash = sha256(comment);

    const agentPubkey = agentPda(agentId);
    const attestPubkey = attestationPda(sessionId, authority.publicKey);
    const [repAuth] = repAuthorityPda();

    const agentBefore = await registryProgram.account.agentAccount.fetch(agentPubkey);

    await attestProgram.methods
      .submitAttestation(agentId, sessionId, 5, Array.from(commentHash), 0)
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

    // Verify attestation PDA
    const att = await attestProgram.account.attestationAccount.fetch(attestPubkey);
    expect(att.attester.toBase58()).to.equal(authority.publicKey.toBase58());
    expect(att.agentId).to.equal(agentId);
    expect(att.sessionId).to.equal(sessionId);
    expect(att.rating).to.equal(5);
    expect(att.agentType).to.equal(0);
    expect(Buffer.from(att.commentHash).toString("hex")).to.equal(commentHash.toString("hex"));

    // Verify agent-registry was updated via CPI
    const agentAfter = await registryProgram.account.agentAccount.fetch(agentPubkey);
    expect(agentAfter.reputationScore.toNumber()).to.equal(
      agentBefore.reputationScore.toNumber() + 5 * 100
    );
    expect(agentAfter.totalAttestations.toNumber()).to.equal(
      agentBefore.totalAttestations.toNumber() + 1
    );
  });

  it("submits a BlockBrain attestation (type=1) — free, no payment required", async () => {
    const agentId = "edu-rwa-v1";
    const sessionId = `sess-att-bb-${Date.now()}`;
    const comment = "Great introduction to RWA concepts, very clear.";
    const commentHash = sha256(comment);

    const agentPubkey = agentPda(agentId);
    const attestPubkey = attestationPda(sessionId, authority.publicKey);
    const [repAuth] = repAuthorityPda();

    const agentBefore = await registryProgram.account.agentAccount.fetch(agentPubkey);

    await attestProgram.methods
      .submitAttestation(agentId, sessionId, 4, Array.from(commentHash), 1)
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
    expect(att.rating).to.equal(4);
    expect(att.agentType).to.equal(1); // blockbrain

    const agentAfter = await registryProgram.account.agentAccount.fetch(agentPubkey);
    expect(agentAfter.reputationScore.toNumber()).to.equal(
      agentBefore.reputationScore.toNumber() + 4 * 100
    );
  });

  it("prevents duplicate attestation for same (attester, session_id)", async () => {
    const agentId = "rwa-agent-v1";
    const sessionId = `sess-dup-att-${Date.now()}`;
    const commentHash = sha256("first review");

    const agentPubkey = agentPda(agentId);
    const attestPubkey = attestationPda(sessionId, authority.publicKey);
    const [repAuth] = repAuthorityPda();

    await attestProgram.methods
      .submitAttestation(agentId, sessionId, 5, Array.from(commentHash), 0)
      .accounts({
        attestation: attestPubkey,
        attester: authority.publicKey,
        agent: agentPubkey,
        repAuthority: repAuth,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([{ pubkey: registryProgram.programId, isSigner: false, isWritable: false }])
      .rpc();

    try {
      await attestProgram.methods
        .submitAttestation(agentId, sessionId, 5, Array.from(commentHash), 0)
        .accounts({
          attestation: attestPubkey,
          attester: authority.publicKey,
          agent: agentPubkey,
          repAuthority: repAuth,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts([{ pubkey: registryProgram.programId, isSigner: false, isWritable: false }])
        .rpc();
      expect.fail("Should have thrown — duplicate attestation blocked by PDA uniqueness");
    } catch (e: any) {
      expect(e).to.exist;
    }
  });

  it("rejects invalid rating (0 or 6)", async () => {
    const agentId = "rwa-agent-v1";
    const sessionId = `sess-bad-rating-${Date.now()}`;
    const agentPubkey = agentPda(agentId);
    const attestPubkey = attestationPda(sessionId, authority.publicKey);
    const [repAuth] = repAuthorityPda();

    try {
      await attestProgram.methods
        .submitAttestation(agentId, sessionId, 6, Array.from(Buffer.alloc(32)), 0)
        .accounts({
          attestation: attestPubkey,
          attester: authority.publicKey,
          agent: agentPubkey,
          repAuthority: repAuth,
          systemProgram: SystemProgram.programId,
        })
        .remainingAccounts([{ pubkey: registryProgram.programId, isSigner: false, isWritable: false }])
        .rpc();
      expect.fail("Should have thrown InvalidRating");
    } catch (e: any) {
      expect(e.message).to.include("InvalidRating");
    }
  });
});
