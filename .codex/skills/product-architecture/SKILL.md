---
name: product-architecture
description: Use when making architectural or cross-cutting implementation decisions for Aegis. Covers platform-first structure, contract stability, vertical-slice implementation, and demo-safe architecture boundaries.
---

# Purpose

Use this skill when making architectural or cross-cutting implementation decisions in Aegis.

Aegis is a digital labor control tower for enterprise AI workers.
It is a platform product first, with a FinOps showcase layered on top.

This skill keeps implementation aligned with that shape.

# What the product is

Aegis is a system where AI workers:

- run in shadow mode before trusted execution
- act under policy and permission constraints
- surface risk before sensitive actions
- request human approval when necessary
- produce replayable, inspectable execution history

The first vertical showcase is FinOps / back-office operations:

- invoice intake
- vendor validation
- mismatch detection
- approval routing
- controlled execution
- audit and replay

# What the product is not

Do not turn Aegis into:

- a generic AI chat assistant
- a finance CRUD app
- a vague governance console
- a hidden agent backend with a pretty wrapper
- a feature pile with no control-tower identity

# Architectural posture

## Platform first

The core system should remain reusable across workflows.
FinOps is the first convincing domain, not the entire architecture.

## Contracts early, churn late

Stabilize:

- worker identities
- workflow run lifecycle
- event/timeline structures
- policy outcomes
- approval objects
- replay/audit objects
- scenario identifiers

Avoid changing these casually once established.

## Vertical slices over horizontal layers

Prefer implementation units like:

- mission control shell
- policy evaluation flow
- approval queue experience
- replay viewer
- seeded risky invoice scenario

Avoid broad slices like:

- frontend
- backend
- AI
- polish

## Deterministic demoability

Critical flows should be driven by stable fixtures and predictable state.
Do not make the showcase depend on flaky remote services or random generation.

# Architectural priorities

When choosing between two implementation directions, prefer the one that improves:

1. product coherence
2. inspectability
3. contract stability
4. demo reliability
5. visible trust/control value

Do not prioritize:

- feature count
- cleverness for its own sake
- speculative scalability
- infrastructure that does not improve the visible product

# Recommended separation of concerns

Keep conceptual separation between:

- routes/pages
- shared UI primitives
- domain contracts
- seeded fixtures/scenarios
- orchestration logic
- policy/risk evaluation
- approval logic
- replay/audit logic
- FinOps scenario modules
- demo launch helpers

Exact folder names may vary, but the conceptual split should remain clear.

# Design constraints that affect architecture

Architecture should support UI that clearly exposes:

- who acted
- what happened
- whether a step was shadowed or executed
- why a decision occurred
- whether a human approved, blocked, or intervened
- how the run can be replayed afterward

If an architectural shortcut hides these surfaces, it is probably the wrong shortcut.

# Safe implementation pattern

When asked to build something:

1. identify the exact wave or capability slice
2. inspect existing contracts and patterns
3. extend before replacing
4. keep feature logic near its domain, not buried in page markup
5. preserve a working seeded demo path

# Anti-patterns

Avoid:

- hardcoding finance assumptions into every shared abstraction
- scattering policy logic across page components
- creating duplicate state models for the same lifecycle
- introducing many one-off badges, tables, or timeline systems
- implementing invisible AI magic with no inspectable surface
- large refactors that are not required for the requested slice

# Done criteria for architecture-sensitive work

A change is architecturally healthy if:

- it strengthens the main product story
- it reuses or cleanly extends existing contracts
- it leaves the repo more coherent, not less
- it does not trap the app inside a single narrow use case
- it improves the ability to build later waves cleanly

# Final reminder

Aegis should always feel like:

- a mission-control product
- a trust layer for AI workers
- a system of visible actions, risk, approvals, and replay

Every implementation choice should strengthen that feeling.
