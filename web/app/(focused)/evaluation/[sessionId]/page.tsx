import EvaluationClient from "./EvaluationClient";

const BLOCKBRAIN_IDS = new Set(["edu-rwa", "edu-defi", "edu-x402"]);

export default function EvaluationPage({
  params,
  searchParams,
}: {
  params: { sessionId: string };
  searchParams: { agentId?: string };
}) {
  const agentId = searchParams.agentId ?? "rwa";
  const agentType: 0 | 1 = BLOCKBRAIN_IDS.has(agentId) ? 1 : 0;
  return (
    <EvaluationClient
      sessionId={params.sessionId}
      agentId={agentId}
      agentType={agentType}
    />
  );
}
