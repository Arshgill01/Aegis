# PLAN.md

## Project

**Aegis** — a digital labor control tower for enterprise AI workers

Aegis is not a generic chatbot and not just a workflow assistant. It is a control layer that allows AI workers to operate on real business workflows under policy, risk, approval, and audit constraints.

The first showcase domain is **FinOps / back-office operations**, where the product demonstrates how AI workers can safely process invoices, validate vendors, detect anomalies, request approvals, and generate replayable execution receipts.

---

## What We Are Building

### Core product

Aegis is a system that lets companies:

- run AI workers in **shadow mode** before trusted execution
- inspect agent plans, actions, and tool usage
- evaluate actions against **policy and risk rules**
- gate risky steps behind **human approvals**
- observe end-to-end **execution timelines**
- replay decisions and inspect **why** they were made
- generate **audit-ready receipts** of agent activity

### First domain showcase

The first vertical demonstration is **FinOps / back-office operations**:

- invoice intake
- vendor matching
- PO / policy verification
- anomaly and mismatch detection
- approval routing
- controlled execution
- audit and replay

### Product thesis translated into build terms

The repo should evolve toward a product where:

- agents are visible, not hidden
- every important action has context and justification
- trust is earned through policy, review, and replay
- the FinOps workflow is a **showcase layer** on top of the platform, not the entire architecture

---

## Primary Build Principles

### 1. Build vertical slices, not disconnected layers

Each wave should result in a visible, testable product capability.
Avoid broad passes like "frontend", "backend", "AI", or "polish".

### 2. Lock contracts early

Core entity shapes, state transitions, and timeline/event structures must stabilize early.
Later waves should build on these contracts rather than reinventing them.

### 3. Optimize for a deterministic demo

The final product must be demo-safe.
Important flows should be seedable and reproducible.
Do not depend on luck, live APIs, or unstable reasoning paths for core showcase moments.

### 4. Show control, not hidden magic

Whenever there is a choice between:

- "system looks magical"
- "system looks inspectable and high-trust"

prefer the second.

### 5. Keep the platform generic, showcase the domain specifically

The architecture should remain platform-oriented.
The FinOps workflow should be implemented as the first concrete high-stakes scenario.

### 6. Preserve visual and interaction coherence

Do not allow each wave to invent its own design language.
Shared UI patterns must be reused across pages and states.

---

## Product Capabilities

Aegis consists of the following major capability areas:

1. **Mission control app shell**
2. **Domain model and seeded scenario data**
3. **Agent runtime and orchestration**
4. **Policy, permissions, and risk evaluation**
5. **Human approval and controlled execution**
6. **Tracing, replay, and auditability**
7. **FinOps workflow intelligence**
8. **Demo and submission support surfaces**

These will be implemented through the waves below.

---

# Wave Breakdown

---

## Wave 1 — Product Skeleton + Mission Control Shell

### Goal

Create the application shell and shared UI foundation so that all future waves plug into a stable product structure.

### What this wave owns

- top-level app structure
- routing / page hierarchy
- navigation model
- global layout
- design tokens / spacing / typography baseline
- reusable UI primitives
- shell-level cards, tables, badges, panels, tabs, timeline containers
- seeded placeholder data plumbing
- empty, loading, and static states for primary screens

### Required routes/pages

- Overview / Mission Control
- Agents
- Runs / Tasks
- Approvals
- Replay / Audit
- Policies
- FinOps Workflow
- Settings / Demo Controls

### Expected outcome

A polished, coherent shell that already looks like a real product, even before deep logic exists.

### Acceptance criteria

- app boots and routes cleanly
- navigation is stable and intentional
- all primary pages exist
- shared UI system is present
- placeholder data can render across the product
- no page looks like an unrelated prototype

### Explicit non-goals

- no real policy engine
- no real approval logic
- no deep agent logic
- no domain-specific intelligence beyond placeholders

### Why this wave matters

Without a stable shell, later prompts will rewrite layout, duplicate components, and fragment the design.

---

## Wave 2 — Domain Model + Simulation Backbone

### Goal

Define the core internal language of the product and create deterministic seeded workflow data.

### What this wave owns

- canonical types / schemas
- domain entities
- workflow lifecycle definitions
- event and timeline structures
- seeded scenario fixtures
- state transition helpers
- simulation-friendly run records
- artifact model for documents and evidence
- basic fake execution progression

### Core entities to define

- `AgentWorker`
- `WorkflowRun`
- `RunStatus`
- `TaskStep`
- `StepStatus`
- `ToolInvocation`
- `PolicyRule`
- `RiskAssessment`
- `ApprovalRequest`
- `ApprovalDecision`
- `ExecutionReceipt`
- `AuditEvent`
- `ReplayFrame`
- `Artifact`
- `Vendor`
- `Invoice`
- `PurchaseOrder`
- `PaymentIntent`
- `ExceptionCase`

### Required outputs

- one canonical place for core data contracts
- deterministic seeded runs
- scenario fixtures for safe and risky workflows
- timeline-friendly event data
- status transitions that later waves can build on

### Acceptance criteria

- all major entities exist and are typed consistently
- a fake run can move across lifecycle states
- seeded data can drive UI pages
- event streams are coherent enough to support replay and audit later
- later waves can reuse the contracts without redefining them

### Explicit non-goals

- no heavy LLM coupling
- no real tool integrations
- no complex business logic yet
- no approval UI behavior beyond data shape compatibility

### Why this wave matters

This is the contract-locking wave.
If this wave is weak, every later wave will invent incompatible data shapes.

---

## Wave 3 — Agent Runtime + Orchestration Layer

### Goal

Make the system genuinely feel agentic by introducing worker roles, handoffs, execution modes, and run progression.

### What this wave owns

- agent registry
- worker definitions and responsibilities
- orchestration model
- task planning / delegation abstraction
- shadow mode vs execute mode
- worker handoff representation
- step execution ordering
- failure / retry / halted states
- run state progression surfaced in UI

### Suggested worker roles

- Intake Worker
- Document Review Worker
- Policy Review Worker
- Risk Worker
- Approval Coordinator
- Execution Worker
- Audit Narrator

### Required behaviors

- workflow run displays multiple workers
- step assignment is visible
- shadow mode and execute mode are distinct
- handoffs are surfaced in timeline / run details
- retries / halted states are representable

### Acceptance criteria

- one seeded workflow can execute end-to-end in simulation
- multiple workers appear with distinct responsibilities
- shadow vs execute mode is visible in the interface
- orchestration state updates are coherent with the domain contracts
- failed or blocked paths do not collapse the UI

### Explicit non-goals

- no fully autonomous external integrations
- no overcomplicated planning engine
- no deep domain rules here; those belong to policy/risk wave

### Why this wave matters

Aegis must feel like a control system for AI workers, not just a workflow dashboard with static labels.

---

## Wave 4 — Policy Engine + Permissions + Risk Scoring

### Goal

Build the product’s core differentiator: actions are evaluated, justified, and either allowed, escalated, or blocked.

### What this wave owns

- policy model and evaluation logic
- scoped permission model
- risk factors and scoring
- allow / log / escalate / block outcomes
- per-step decision rationale
- rule explanation surfaces
- risk badges and severity labeling
- policy inspection UI

### Policy examples to support

- unknown vendor
- invoice total exceeds threshold
- invoice and PO mismatch
- recent bank detail change
- missing documentation
- disallowed action type
- action outside worker permission scope
- suspicious multi-step risk accumulation

### Expected decision outputs

Each important step should end in one of:

- allowed
- allowed with audit emphasis
- requires approval
- blocked

Each decision should also expose:

- triggered rule(s)
- risk score
- decision explanation
- evidence references where possible

### Acceptance criteria

- actions are evaluated through a policy/risk path
- the UI clearly shows risk and policy outcomes
- blocked and escalated states exist and are understandable
- users can inspect why a decision was made
- permissions meaningfully influence outcomes

### Explicit non-goals

- no generic "AI says this is risky" black box
- no vague labels without rationale
- no approval execution yet; that belongs to the next wave

### Why this wave matters

This wave transforms Aegis from an agent showcase into a trust/control platform.

---

## Wave 5 — Human Approval + Controlled Execution

### Goal

Introduce a first-class human-in-the-loop layer so risky steps pause, request review, and resume safely.

### What this wave owns

- approval inbox / queue
- approval detail page
- approve / reject / request changes actions
- step pause and resume
- continuation after approval
- assignment / reviewer identity model
- approval history
- intervention and emergency stop controls

### Required behaviors

- escalated steps create approval requests
- approvers can inspect context before deciding
- decisions change workflow state
- resumed runs continue visibly
- rejected steps surface cleanly

### Key UX expectations

Approvals should feel operational, not decorative.
A user should be able to understand:

- what happened
- why approval is needed
- what risk is involved
- what action they are authorizing or blocking

### Acceptance criteria

- approval requests are created from policy outcomes
- decisions mutate workflow state coherently
- resumed execution is visible in run timeline
- rejected runs or steps remain understandable
- intervention controls feel integrated with the mission-control story

### Explicit non-goals

- no complex org chart / enterprise admin system
- no overbuilt permissions management UI
- no unnecessary auth complexity for the hackathon version

### Why this wave matters

This wave enables the strongest demo moment:
the agent gets far on its own, then Aegis steps in exactly when control matters.

---

## Wave 6 — Replay, Audit, Receipts, Explainability

### Goal

Make every important run inspectable, replayable, and audit-friendly.

### What this wave owns

- replay viewer
- chronological event stream rendering
- state diff or step transition view
- execution receipt
- evidence panels
- decision rationale narrative
- shadow vs executed comparison
- downloadable or shareable audit summary surface

### Core experience

A reviewer should be able to inspect any run and answer:

- what happened
- in what order
- which worker acted
- what policy applied
- what evidence was considered
- what was allowed, blocked, or approved
- whether the action was simulated or executed

### Required surfaces

- replay timeline
- event detail panel
- receipt / summary view
- step explanation panels
- shadow vs execute diff surfaces

### Acceptance criteria

- runs can be replayed with meaningful event fidelity
- users can inspect decision history without ambiguity
- receipts summarize the run clearly
- shadow vs execute comparisons make sense
- audit surfaces feel like a product feature, not debug logs

### Explicit non-goals

- no overengineering of compliance exports
- no sprawling reporting system beyond what supports the demo and product narrative

### Why this wave matters

Most hackathon agent demos stop at "it worked."
Aegis should also prove:

- what happened
- why it happened
- whether it was safe
- what changed

This wave adds major perceived depth.

---

## Wave 7 — FinOps Vertical Workflow Intelligence

### Goal

Apply the platform to a concrete, high-stakes business workflow that makes the product immediately understandable.

### What this wave owns

- FinOps-specific domain copy and visual language
- invoice / vendor / PO / payment artifacts
- business rules and mismatch scenarios
- exception-specific summaries
- domain-focused metrics and cards
- workflow branching based on finance/back-office conditions
- scenario pages and seeded domain cases

### Core workflow

The system should support a credible flow such as:

1. invoice intake
2. vendor resolution
3. PO / amount / documentation verification
4. policy and risk review
5. exception detection
6. approval routing if needed
7. controlled execution or block
8. receipt and replay completion

### Required demo scenarios

At minimum, support these seeded cases:

1. **Safe invoice**  
   low-risk path with mostly autonomous progression

2. **Unknown vendor**  
   escalation due to identity uncertainty

3. **Invoice mismatch**  
   mismatch between invoice and PO / expected amount

4. **Bank detail change**  
   high-risk halt or manual intervention

5. **Missing documentation**  
   incomplete artifact state that prevents full execution

6. **Policy violation**  
   hard block with explanation

### Acceptance criteria

- multiple FinOps scenarios are seeded and demo-safe
- domain language is integrated across the UI
- risks feel high-stakes and business-legible
- the platform nature of Aegis remains clear beneath the vertical scenario
- a judge can understand the use case in under a minute

### Explicit non-goals

- no attempt to become a full accounting suite
- no unnecessary ERP complexity
- no broad multi-domain expansion during this first pass

### Why this wave matters

The platform becomes much more compelling when demonstrated in a workflow where risk, policy, and approvals are obviously important.

---

## Wave 8 — Demo Polish + Submission Support

### Goal

Turn the product into a deterministic, presentation-ready hackathon submission.

### What this wave owns

- final empty/loading/error state polish
- seeded demo controls
- showcase scenario launcher
- UI motion and smoothness improvements
- screenshot-ready states
- deterministic data reset support
- README and architecture support assets
- presentation-friendly labels and copy cleanup
- obvious entry points for judges / reviewers

### Required outputs

- a demo-safe route or controls for launching showcase scenarios
- stable seeded states for screenshots and recording
- clear repo onboarding
- architecture-consistent labels and descriptions
- no broken or dead routes in the main experience

### Acceptance criteria

- app feels intentionally finished
- demo can be rerun reliably
- primary screenshots and walkthrough moments are stable
- project structure is understandable to reviewers
- nothing essential depends on improvisation during the final demo

### Explicit non-goals

- no late-stage feature explosion
- no unnecessary rewrites of stable architecture
- no additions that threaten demo reliability

### Why this wave matters

A great product idea loses if the final presentation feels fragile or unfinished.
This wave is real product work, not cosmetic work.

---

# Dependency Order

The waves should be implemented in this order:

1. Wave 1 — Product Skeleton + Mission Control Shell
2. Wave 2 — Domain Model + Simulation Backbone
3. Wave 3 — Agent Runtime + Orchestration Layer
4. Wave 4 — Policy Engine + Permissions + Risk Scoring
5. Wave 5 — Human Approval + Controlled Execution
6. Wave 6 — Replay, Audit, Receipts, Explainability
7. Wave 7 — FinOps Vertical Workflow Intelligence
8. Wave 8 — Demo Polish + Submission Support

### Dependency notes

- Wave 1 must exist before deep feature work to prevent UI fragmentation.
- Wave 2 must lock contracts before waves 3–7 build behavior on top.
- Wave 4 depends on wave 2 and wave 3 data structures being stable.
- Wave 5 depends on policy outcomes existing first.
- Wave 6 depends on meaningful event history from waves 3–5.
- Wave 7 depends on the platform layers already existing.
- Wave 8 depends on all core flows already being stable.

---

# Cross-Wave Engineering Standards

## State and contracts

- core types should be centralized
- seeded demo data should be deterministic
- avoid ad hoc inline object shapes in feature components
- lifecycle transitions should be explicit and inspectable

## UI consistency

- reuse shared components and patterns
- badges, panels, cards, tables, timelines, and empty states should be standardized
- risk, approval, policy, and worker identities should have consistent visual language

## Product consistency

- always reflect whether a step is shadowed, executed, blocked, or pending approval
- every important action should be connected to context
- never hide decision rationale when a user would need it

## Demo safety

- prioritize deterministic fixtures over unstable live logic
- support resettable seeded runs
- do not depend on unpredictable external services for showcase-critical paths

## Scope discipline

- platform first, vertical second
- one strong domain > many shallow domains
- visible coherence > number of features

---

# Suggested Repository Areas

These are not hard requirements, but the repo should generally trend toward clear separation between:

- app / routes / pages
- shared UI components
- domain types and schemas
- seeded fixtures / scenarios
- orchestration logic
- policy / permissions / risk evaluation
- approval logic
- replay / audit logic
- FinOps-specific scenario modules
- demo helpers / launchers

The exact folder structure can vary, but the conceptual separation should remain stable.

---

# Critical Demo Story to Preserve

The product must always support this narrative:

1. an AI worker begins a business workflow
2. the system shows what the worker is trying to do
3. low-risk steps proceed smoothly
4. a risky step is detected
5. policy and risk logic explain the concern
6. the workflow is gated or blocked
7. a human can approve, reject, or intervene
8. the system records everything
9. the full run can be replayed afterward

If future implementation work weakens this story, that work is misaligned.

---

# Anti-Patterns to Avoid

## 1. Generic chatbot drift

Do not let the product collapse into a chat assistant with a few status cards.

## 2. Overbuilding integrations

Do not sink time into deep external integrations if they do not materially improve the main demo.

## 3. Premature realism

Do not chase enterprise-grade infrastructure complexity that does not improve the visible product.

## 4. Too many domains

Do not add extra verticals before the FinOps showcase is strong.

## 5. Visual inconsistency

Do not let later waves add one-off styles and interaction patterns that fight the shell.

## 6. Hidden system logic

Do not hide the reason why something was blocked, escalated, or approved.

## 7. Late architecture churn

Do not rewrite core contracts or route structure casually after Wave 2 unless absolutely necessary.

---

# Success Criteria

The project is successful if, by the end:

- Aegis feels like a real product, not a stitched demo
- the agent control-tower thesis is obvious from the UI
- the FinOps scenario makes the value instantly understandable
- policy, risk, approval, and replay work together coherently
- a reviewer can inspect what happened and why
- seeded scenarios reliably support a strong demo
- the system looks ambitious, technically serious, and presentation-ready

---

# Implementation Mindset for Future Prompts

When creating future prompts for Codex:

- each prompt should map to a single wave or sub-slice of a wave
- prompts should reference the exact capability being implemented
- prompts should avoid asking for broad repo-wide rewrites
- prompts should preserve existing contracts unless the prompt explicitly authorizes structural changes
- each pass should end with visible acceptance criteria, not vague "improve" language

This plan exists to keep implementation coherent, mergeable, and demo-strong.
