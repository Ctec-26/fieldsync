import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import type { AnchorWallet } from "./anchor-client";
import {
  getProvider,
  getSessionPaymentProgram,
  AGENT_ONCHAIN_ID,
  AGENT_AUTHORITY_PUBKEY,
  paymentPda,
} from "./anchor-client";

export async function payForSession(
  connection: Connection,
  wallet: AnchorWallet,
  frontendAgentId: string,
  sessionId: string
): Promise<string> {
  const provider = getProvider(connection, wallet);
  const program = getSessionPaymentProgram(provider);

  const onChainAgentId = AGENT_ONCHAIN_ID[frontendAgentId] ?? frontendAgentId;
  const paymentPubkey = paymentPda(sessionId, wallet.publicKey);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const txSig = await (program as any).methods
    .payForSession(onChainAgentId, sessionId)
    .accounts({
      payment: paymentPubkey,
      payer: wallet.publicKey,
      agentAuthority: AGENT_AUTHORITY_PUBKEY,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

  return txSig;
}

export async function getSessionPayment(
  connection: Connection,
  sessionId: string,
  payer: PublicKey
): Promise<{ isConsumed: boolean; amountLamports: number } | null> {
  try {
    const { getProvider: gp, getSessionPaymentProgram: getSpp, paymentPda: getPda } = await import("./anchor-client");
    // Read-only dummy wallet — no signing needed for account fetch
    const dummyWallet: AnchorWallet = {
      publicKey: payer,
      signTransaction: async (tx) => tx,
      signAllTransactions: async (txs) => txs,
    };
    const provider = gp(connection, dummyWallet);
    const program = getSpp(provider);
    const pda = getPda(sessionId, payer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const account = await (program.account as any).sessionPaymentAccount.fetch(pda);
    return {
      isConsumed: account.isConsumed as boolean,
      amountLamports: (account.amountLamports as { toNumber(): number }).toNumber(),
    };
  } catch {
    return null;
  }
}
