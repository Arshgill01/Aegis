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
          items: [
            {
              label: "Stage 1",
              title: "Invoice intake and normalization",
              description: "The route starts with document receipt, field extraction, and baseline validation before any payment-sensitive action exists.",
            },
            {
              label: "Stage 2",
              title: "Vendor and PO reconciliation",
              description: "Matching work should stay legible as a concrete checkpoint, not disappear into a generic background process.",
            },
            {
              label: "Stage 3",
              title: "Exception or approval path",
              description: "The workflow map already reserves a visible branch where risky steps trigger policy and human review.",
            },
          ],
          footer: "The FinOps route should feel credible without making the whole product finance-specific.",
        },
        {
          title: "Exception workspace",
          description: "Reserve the parallel panel for mismatches, supporting evidence, and human escalation tied to the workflow state.",
          items: [
            {
              label: "Mismatch",
              title: "Quantity, pricing, or vendor identity conflicts",
              description: "This panel is where seeded scenarios can show why the workflow diverged from the happy path.",
            },
            {
              label: "Evidence",
              title: "Artifacts stay close to the exception",
              description: "Supporting documents, summary notes, and approval rationale should sit here rather than in detached modal flows.",
            },
          ],
          footer: "Exception handling is part of the product story, not a side case.",
        },
      ]}
      placeholder={{
        label: "Route shell",
        title: "FinOps scenarios will anchor the demo here",
        description: "The screen already reserves room for concrete workflow posture without hardcoding the entire product around invoices.",
        helper: "Later waves should use seeded scenarios to make this route credible and deterministic.",
        notes: [
          "FinOps is the showcase layer, not the architectural boundary.",
          "Exception handling should read as a first-class branch of the workflow.",
          "This route should always connect back to approvals, policies, and replay.",
        ],
      }}
    />
  );
}
