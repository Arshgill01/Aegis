import { PageScaffold } from "../components/page-scaffold";

export function FinopsPage() {
  return (
    <PageScaffold
      eyebrow="Showcase"
      title="FinOps Workflow"
      description="Ground the platform in a believable back-office workflow while keeping the architecture open for broader enterprise AI operations."
      stats={[
        { label: "Scenario type", value: "invoice operations", tone: "neutral" },
        { label: "Outcome model", value: "review before payment", tone: "success" },
        { label: "Domain depth", value: "placeholder narrative", tone: "warning" },
      ]}
      focus={[
        {
          title: "Concrete workflow",
          description: "This route anchors the product story around invoice intake, vendor checks, and approval-sensitive execution.",
        },
        {
          title: "Platform fit",
          description: "It remains a showcase layer, not a finance-only application surface.",
        },
      ]}
      sections={[
        {
          title: "Workflow map",
          description: "Use this region for stage-level progress through intake, validation, exception handling, and controlled execution.",
        },
        {
          title: "Exception workspace",
          description: "Reserve the parallel panel for mismatches, supporting evidence, and human escalation tied to the workflow state.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "FinOps scenarios will anchor the demo here",
        description: "The screen already reserves room for concrete workflow posture without hardcoding the entire product around invoices.",
        helper: "Later waves should use seeded scenarios to make this route credible and deterministic.",
      }}
    />
  );
}
