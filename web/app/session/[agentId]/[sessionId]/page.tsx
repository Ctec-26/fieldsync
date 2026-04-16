import { notFound } from "next/navigation";
import { getAgent } from "@/lib/agents";
import SessionClient from "./SessionClient";

export default function SessionPage({
  params,
}: {
  params: { agentId: string; sessionId: string };
}) {
  const agent = getAgent(params.agentId);
  if (!agent) notFound();
  return <SessionClient agent={agent} sessionId={params.sessionId} />;
}
