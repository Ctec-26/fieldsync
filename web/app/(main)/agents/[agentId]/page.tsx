import { notFound } from "next/navigation";
import { getAgent, AGENTS_LIST } from "@/lib/agents";
import { getAttestationsForAgent } from "@/lib/mock-attestations";
import AgentProfileClient from "./AgentProfileClient";

export function generateStaticParams() {
  return AGENTS_LIST.map((a) => ({ agentId: a.id }));
}

export function generateMetadata({ params }: { params: { agentId: string } }) {
  const agent = getAgent(params.agentId);
  if (!agent) return { title: "Not Found" };
  return {
    title: `${agent.name} — FieldSync`,
    description: agent.bio,
  };
}

export default function AgentProfilePage({ params }: { params: { agentId: string } }) {
  const agent = getAgent(params.agentId);
  if (!agent) notFound();
  const attestations = getAttestationsForAgent(params.agentId);
  return <AgentProfileClient agent={agent} attestations={attestations} />;
}
