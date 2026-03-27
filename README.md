# Aegis

Aegis is a digital labor control tower for enterprise AI workers.

It is not a generic chatbot, not a lightweight workflow assistant, and not a finance dashboard with AI branding. Aegis is the control layer that lets AI workers operate on real workflows under policy, risk, approval, and audit constraints.

The first showcase domain is FinOps and back-office operations, where the product demonstrates how AI workers can process invoices, validate vendors, detect anomalies, request approvals, and produce replayable execution receipts.

## Product Thesis

AI work in high-stakes operations should be visible, gated, and explainable.

Aegis is being built around a simple posture:

- workers should be observable, not hidden
- low-risk actions should move smoothly
- risky actions should trigger policy and approval controls
- every important decision should be inspectable afterward
- trust should come from control, replay, and evidence rather than vague automation claims

## What Aegis Is Building

The platform is designed to support:

- shadow mode before trusted execution
- agent planning, task progression, and worker handoffs
- policy and risk evaluation for actions
- human approval gates for sensitive steps
- end-to-end execution timelines
- replay and audit surfaces for post-run inspection
- deterministic seeded scenarios for reliable demos

FinOps is the first vertical showcase, not the architectural boundary. The long-term product is a reusable control plane for enterprise AI work.

## First Showcase: FinOps Operations

The initial demonstration focuses on high-stakes back-office workflows such as:

- invoice intake
- vendor matching
- purchase order verification
- anomaly and mismatch detection
- approval routing
- controlled execution
- audit and replay

This domain is intentionally concrete: it gives the product a credible operational story while keeping the underlying platform reusable.

## Product Principles

The repository is organized around a few non-negotiable principles:

- platform first: build a reusable control layer, not a one-off finance app
- control over magic: prioritize inspectable behavior over opaque “AI did it” moments
- deterministic demos: important flows must be seedable and stable
- explainability by default: decisions should expose reasons, evidence, and policy context
- premium mission-control UX: the product should feel operational, coherent, and trustworthy

## Build Plan

Development is structured in waves, with each wave delivering a visible product capability:

1. mission control shell and shared UI foundation
2. domain model and deterministic simulation backbone
3. agent runtime and orchestration
4. policy, permissions, and risk evaluation
5. human approval and controlled execution
6. tracing, replay, and auditability
7. FinOps workflow intelligence
8. demo and submission support surfaces

The goal is not feature count. The goal is a coherent, replayable product where an AI worker can begin a workflow, encounter a risky step, get gated by policy, involve a human when required, and leave behind a clear audit trail.

## Repository Source Of Truth

If you are working in this repository, start here:

- [`PLAN.md`](./PLAN.md): product direction, capability map, and wave breakdown
- [`AGENTS.md`](./AGENTS.md): implementation rules, architecture guardrails, and workflow expectations for coding agents
- [`.codex/skills/`](./.codex/skills/): specialized guidance for recurring implementation areas

`PLAN.md` defines what should be built. `AGENTS.md` defines how work should be done.

## Current State

This repository is still at the foundation stage. The planning documents and skill guides are in place, and the implementation work is expected to begin from the mission-control shell and shared product structure.

That means the repo should evolve toward a product where:

1. an AI worker starts a workflow
2. the system shows what the worker is doing
3. low-risk work proceeds
4. risky work is detected and explained
5. approvals gate sensitive actions
6. the full run can be replayed and audited afterward
