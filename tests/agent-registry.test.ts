import * as anchor from "@coral-xyz/anchor";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect } from "chai";
import type { AgentRegistry } from "../target/types/agent_registry";

describe("agent-registry", () => {
  const provider = AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AgentRegistry as Program<AgentRegistry>;
  const authority = provider.wallet as anchor.Wallet;

  function agentPda(agentId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("agent"), Buffer.from(agentId)],
      program.programId
    );
  }

  // ── Register marketplace agents ─────────────────────────────

  it("registers RWA marketplace agent", async () => {
    const agentId = "rwa-agent-v1";
    const [agentPubkey] = agentPda(agentId);

    await program.methods
      .registerAgent(agentId, "RWA Agent", "rwa", 0)
      .accounts({ agent: agentPubkey, authority: authority.publicKey, systemProgram: SystemProgram.programId })
      .rpc();

    const account = await program.account.agentAccount.fetch(agentPubkey);
    expect(account.agentId).to.equal(agentId);
    expect(account.name).to.equal("RWA Agent");
    expect(account.specialization).to.equal("rwa");
    expect(account.agentType).to.equal(0);
    expect(account.isActive).to.be.true;
    expect(account.reputationScore.toNumber()).to.equal(0);
    expect(account.totalSessions.toNumber()).to.equal(0);
    expect(account.totalAttestations.toNumber()).to.equal(0);
  });

  it("registers DeFi marketplace agent", async () => {
    const agentId = "defi-agent-v1";
    const [agentPubkey] = agentPda(agentId);

    await program.methods
      .registerAgent(agentId, "DeFi Agent", "defi", 0)
      .accounts({ agent: agentPubkey, authority: authority.publicKey, systemProgram: SystemProgram.programId })
      .rpc();

    const account = await program.account.agentAccount.fetch(agentPubkey);
    expect(account.agentId).to.equal(agentId);
    expect(account.agentType).to.equal(0);
  });

  it("registers x402 marketplace agent", async () => {
    const agentId = "x402-agent-v1";
    const [agentPubkey] = agentPda(agentId);

    await program.methods
      .registerAgent(agentId, "x402 Agent", "x402", 0)
      .accounts({ agent: agentPubkey, authority: authority.publicKey, systemProgram: SystemProgram.programId })
      .rpc();

    const account = await program.account.agentAccount.fetch(agentPubkey);
    expect(account.name).to.equal("x402 Agent");
  });

  // ── Register BlockBrain educator agents ────────────────────

  it("registers Educator RWA BlockBrain agent (type=1)", async () => {
    const agentId = "edu-rwa-v1";
    const [agentPubkey] = agentPda(agentId);

    await program.methods
      .registerAgent(agentId, "Educator RWA Agent", "educator-rwa", 1)
      .accounts({ agent: agentPubkey, authority: authority.publicKey, systemProgram: SystemProgram.programId })
      .rpc();

    const account = await program.account.agentAccount.fetch(agentPubkey);
    expect(account.agentType).to.equal(1);
    expect(account.specialization).to.equal("educator-rwa");
  });

  it("registers Educator DeFi BlockBrain agent (type=1)", async () => {
    const agentId = "edu-defi-v1";
    const [agentPubkey] = agentPda(agentId);

    await program.methods
      .registerAgent(agentId, "Educator DeFi Agent", "educator-defi", 1)
      .accounts({ agent: agentPubkey, authority: authority.publicKey, systemProgram: SystemProgram.programId })
      .rpc();

    const account = await program.account.agentAccount.fetch(agentPubkey);
    expect(account.agentType).to.equal(1);
  });

  it("registers Educator x402 BlockBrain agent (type=1)", async () => {
    const agentId = "edu-x402-v1";
    const [agentPubkey] = agentPda(agentId);

    await program.methods
      .registerAgent(agentId, "Educator x402 Agent", "educator-x402", 1)
      .accounts({ agent: agentPubkey, authority: authority.publicKey, systemProgram: SystemProgram.programId })
      .rpc();

    const account = await program.account.agentAccount.fetch(agentPubkey);
    expect(account.agentType).to.equal(1);
  });

  // ── Status management ───────────────────────────────────────

  it("deactivates an agent (authority only)", async () => {
    const agentId = "rwa-agent-v1";
    const [agentPubkey] = agentPda(agentId);

    await program.methods
      .updateAgentStatus(false)
      .accounts({ agent: agentPubkey, authority: authority.publicKey })
      .rpc();

    const account = await program.account.agentAccount.fetch(agentPubkey);
    expect(account.isActive).to.be.false;
  });

  it("reactivates an agent", async () => {
    const agentId = "rwa-agent-v1";
    const [agentPubkey] = agentPda(agentId);

    await program.methods
      .updateAgentStatus(true)
      .accounts({ agent: agentPubkey, authority: authority.publicKey })
      .rpc();

    const account = await program.account.agentAccount.fetch(agentPubkey);
    expect(account.isActive).to.be.true;
  });

  it("rejects unauthorized agent type", async () => {
    const agentId = "bad-type-agent";
    const [agentPubkey] = agentPda(agentId);

    try {
      await program.methods
        .registerAgent(agentId, "Bad Agent", "bad", 99)
        .accounts({ agent: agentPubkey, authority: authority.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      expect.fail("Should have thrown");
    } catch (e: any) {
      expect(e.message).to.include("InvalidAgentType");
    }
  });
});
