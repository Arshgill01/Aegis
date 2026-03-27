import { PageShell } from "../components/shell/PageShell";
import { StackList } from "../components/shell/StackList";
import { SurfaceCard } from "../components/shell/SurfaceCard";

type RoutePlaceholderPageProps = {
  title: string;
  category: string;
  summary: string;
};

export function RoutePlaceholderPage({
  title,
  category,
  summary,
}: RoutePlaceholderPageProps) {
  return (
    <PageShell
      eyebrow={category}
      title={title}
      description={summary}
      signals={[
        { label: "Wave 1", detail: "Stable shell active" },
        { label: "Status", detail: "Ready for downstream feature branches" },
      ]}
      summaryCards={[
        { label: "Route posture", value: "Registered" },
        { label: "Layout", value: "Mission-control shell" },
        { label: "Placeholder state", value: "Intentional" },
        { label: "Next step", value: "Feature-specific internals" },
      ]}
      primaryColumn={
        <SurfaceCard
          eyebrow="Route frame"
          title="Why this route exists"
          footer="Wave 1 establishes structure and tone without prematurely implementing later-wave business logic."
        >
          <StackList
            items={[
              {
                title: "Stable path",
                detail: "This route is registered in the app hierarchy and can accept deeper feature work later.",
              },
              {
                title: "Shared shell",
                detail: "The same layout, summary cards, and side rail pattern apply across the product.",
              },
              {
                title: "Premium placeholder",
                detail: "The screen looks intentional instead of reading like a broken or empty prototype.",
              },
            ]}
          />
        </SurfaceCard>
      }
      secondaryColumn={
        <SurfaceCard eyebrow="Downstream contract" title="Ready for later waves">
          <StackList
            items={[
              {
                title: "Route stability",
                detail: "Downstream branches can build inside this page without changing top-level navigation.",
              },
              {
                title: "Page wrapper",
                detail: "Summary, content, and context panels already render consistently across screens.",
              },
            ]}
          />
        </SurfaceCard>
      }
    />
  );
}
