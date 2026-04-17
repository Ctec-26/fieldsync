import { Connection, clusterApiUrl } from "@solana/web3.js";

const RPC_URL =
  process.env.NEXT_PUBLIC_HELIUS_RPC ||
  clusterApiUrl("devnet");

let _connection: Connection | null = null;

export function getConnection(): Connection {
  if (!_connection) _connection = new Connection(RPC_URL, "confirmed");
  return _connection;
}

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function txUrl(signature: string): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
}

export function generateMockTxSignature(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789";
  return Array.from({ length: 64 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export function generateMockBlockHeight(): number {
  return 312_800_000 + Math.floor(Math.random() * 200_000);
}
