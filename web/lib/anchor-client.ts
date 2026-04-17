/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import AgentRegistryIdl from "./idl/agent_registry.json";
import ReputationAttestationIdl from "./idl/reputation_attestation.json";
import SessionPaymentIdl from "./idl/session_payment.json";

// Minimal wallet interface compatible with AnchorProvider (excludes NodeWallet.payer)
export interface AnchorWallet {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]>;
}

export const PROGRAM_IDS = {
  agentRegistry: new PublicKey("5rPjuKt8N2MM9b2EHbU9MbHCC3SdQrmy2K7uneFJ1g1A"),
  reputationAttestation: new PublicKey("Gyu1zPoU2BXAfxAsCnQX2kgk4ktW8n7mBsjRALdaWEPt"),
  sessionPayment: new PublicKey("8T4ituXHy6NgE41qd67v61Gnvx78Ln96AdhqjTpuY7CE"),
};

// Maps frontend agent IDs to on-chain agent IDs
export const AGENT_ONCHAIN_ID: Record<string, string> = {
  rwa: "rwa-agent-v1",
  defi: "defi-agent-v1",
  x402: "x402-agent-v1",
  "edu-rwa": "edu-rwa-v1",
  "edu-defi": "edu-defi-v1",
  "edu-x402": "edu-x402-v1",
};

// The wallet that registered all agents on devnet — receives session payments
export const AGENT_AUTHORITY_PUBKEY = new PublicKey(
  process.env.NEXT_PUBLIC_AGENT_AUTHORITY ?? "ELPu1iMWu4WbrzdnCJR6jzGHyZMVYAiXJAANaTMHMu3b"
);

export function getProvider(connection: Connection, wallet: AnchorWallet): AnchorProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new AnchorProvider(connection, wallet as any, { commitment: "confirmed" });
}

export function getAgentRegistryProgram(provider: AnchorProvider): Program<any> {
  return new Program(AgentRegistryIdl as any, provider);
}

export function getReputationAttestationProgram(provider: AnchorProvider): Program<any> {
  return new Program(ReputationAttestationIdl as any, provider);
}

export function getSessionPaymentProgram(provider: AnchorProvider): Program<any> {
  return new Program(SessionPaymentIdl as any, provider);
}

export function agentPda(agentId: string): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("agent"), Buffer.from(agentId)],
    PROGRAM_IDS.agentRegistry
  )[0];
}

export function paymentPda(sessionId: string, payer: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("payment"), Buffer.from(sessionId), payer.toBuffer()],
    PROGRAM_IDS.sessionPayment
  )[0];
}

export function attestationPda(sessionId: string, attester: PublicKey): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("attestation"), Buffer.from(sessionId), attester.toBuffer()],
    PROGRAM_IDS.reputationAttestation
  )[0];
}

export function repAuthorityPda(): PublicKey {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("rep_auth")],
    PROGRAM_IDS.reputationAttestation
  )[0];
}
