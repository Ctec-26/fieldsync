import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agents";
import SessionClient from "./SessionClient";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ agentId: string; sessionId: string }>;
}) {
  const { agentId, sessionId } = await params;
  const agent = getAgent(agentId);
  if (!agent) notFound();
  return <SessionClient agent={agent} sessionId={sessionId} />;
}
