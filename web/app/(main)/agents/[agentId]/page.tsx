import { notFound } from "next/navigation";
import { getAgent, AGENTS_LIST, BLOCKBRAIN_LIST } from "@/lib/agents";
import { getAttestationsForAgent } from "@/lib/mock-attestations";
import AgentProfileClient from "./AgentProfileClient";

export function generateStaticParams() {
  return [...AGENTS_LIST, ...BLOCKBRAIN_LIST].map((a) => ({ agentId: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) return { title: "Not Found" };
  return {
    title: `${agent.name} — FieldSync`,
    description: agent.bio,
  };
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) notFound();
  const attestations = getAttestationsForAgent(agentId);
  return <AgentProfileClient agent={agent} attestations={attestations} />;
}
