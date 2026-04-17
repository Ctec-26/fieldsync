import { Connection, SystemProgram } from "@solana/web3.js";
import type { AnchorWallet } from "./anchor-client";
import {
  getProvider,
  getReputationAttestationProgram,
  PROGRAM_IDS,
  AGENT_ONCHAIN_ID,
  agentPda,
  attestationPda,
  repAuthorityPda,
} from "./anchor-client";

async function sha256Bytes(text: string): Promise<number[]> {
  const encoded = new TextEncoder().encode(text || "");
  const buf = encoded.buffer.slice(0) as ArrayBuffer;
  const hashBuffer = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuffer));
}

export async function submitAttestation(
  connection: Connection,
  wallet: AnchorWallet,
  frontendAgentId: string,
  sessionId: string,
  rating: number,
  comment: string,
  agentType: 0 | 1 = 0
): Promise<string> {
  const provider = getProvider(connection, wallet);
  const program = getReputationAttestationProgram(provider);

  const onChainAgentId = AGENT_ONCHAIN_ID[frontendAgentId] ?? frontendAgentId;
  const commentHash = await sha256Bytes(comment);
  const agentPubkey = agentPda(onChainAgentId);
  const attestPubkey = attestationPda(sessionId, wallet.publicKey);
  const repAuth = repAuthorityPda();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txSig = await (program as any).methods
    .submitAttestation(onChainAgentId, sessionId, rating, commentHash, agentType)
    .accounts({
      attestation: attestPubkey,
      attester: wallet.publicKey,
      agent: agentPubkey,
      repAuthority: repAuth,
      systemProgram: SystemProgram.programId,
    })
    .remainingAccounts([
      { pubkey: PROGRAM_IDS.agentRegistry, isSigner: false, isWritable: false },
    ])
    .rpc();

  return txSig;
}
