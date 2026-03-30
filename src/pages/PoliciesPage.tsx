import { usePoliciesPageData } from "../app/data/hooks";
import { PageShell } from "../components/shell/PageShell";
import {
  ActivePolicyDecisionsCard,
  PolicyCatalogCard,
  PolicyExplanationCard,
  PolicyOutcomeGuideCard,
} from "./policies/PolicyControlSections";

export function PoliciesPage() {
  const pageData = usePoliciesPageData();

  return (
    <PageShell
      eyebrow={pageData.eyebrow}
      title={pageData.title}
      description={pageData.description}
      summaryCards={pageData.summaryCards}
      signals={pageData.signals}
      primaryColumn={
        <>
          <PolicyCatalogCard rules={pageData.policyRules} />
          <ActivePolicyDecisionsCard decisions={pageData.activeDecisions} />
        </>
      }
      secondaryColumn={
        <>
          <PolicyExplanationCard explanation={pageData.explanation} />
          <PolicyOutcomeGuideCard guide={pageData.outcomeGuide} />
        </>
      }
    />
  );
}
