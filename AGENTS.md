# AGENTS.md

## Purpose

This repository is for **Aegis** — a digital labor control tower for enterprise AI workers.

The product is **not** a generic chatbot, and it is **not** a narrow finance app. It is a control layer that allows AI workers to operate on real workflows under policy, risk, approval, and audit constraints.

The first showcase domain is **FinOps / back-office operations**, used to demonstrate the platform through high-stakes workflows like invoice intake, vendor validation, mismatch detection, approval routing, controlled execution, and replayable audit trails.

This file defines how coding agents should behave while working in this repo.

---

## Source of truth

When making implementation decisions, use this priority order:

1. `PLAN.md`
2. existing repo architecture and contracts
3. this file
4. prompt-specific instructions for the current task
5. local code comments and TODOs

If something conflicts:

- prefer the current prompt for the exact requested slice
- prefer `PLAN.md` for project structure and wave boundaries
- prefer existing stable contracts over ad hoc rewrites

---

## What this product must feel like

Aegis should feel like:

- a **mission-control product**
- a **trust and control layer** for AI workers
- a system where actions are visible, gated, explainable, and replayable
- a platform first, with a FinOps showcase layered on top

Aegis should **not** drift into:

- a generic assistant/chat app
- a plain CRUD finance dashboard
- a vague “AI governance” admin panel
- a toy agent demo with hidden logic

---

## Core product constraints

### 1. Platform first

Build Aegis as a reusable control-plane product.
The FinOps workflow is the first vertical showcase, not the entire architecture.

### 2. Control over magic

Prefer inspectable, trustworthy behavior over mysterious “AI did it” experiences.

### 3. Deterministic demos matter

Core showcase flows must be seedable, stable, and replayable.
Do not make critical demo moments depend on unstable live behavior.

### 4. Keep the product visible

The user should be able to inspect:

- what happened
- who/which worker acted
- what was blocked or allowed
- why it happened
- what evidence or policy influenced it

### 5. Preserve a premium product feel

The UI should look like a coherent enterprise product, not a pile of disconnected feature screens.

---

# How agents should work

## Default working style

When assigned a task:

1. identify the exact wave / sub-capability being touched
2. locate the nearest existing contracts and components
3. implement the smallest clean slice that fully satisfies the request
4. avoid repo-wide rewrites unless explicitly required
5. leave the repo in a coherent, runnable state

## Prefer vertical completion

Do not partially touch five areas if one clean slice can be completed properly.
Favor self-contained, mergeable progress.

## Preserve coherence

Before adding a new type, component, pattern, or state:

- check whether an equivalent already exists
- reuse or extend existing patterns where reasonable
- avoid introducing parallel systems

---

# Wave discipline

All work should align to the wave model in `PLAN.md`.

## Allowed mindset

A prompt may target:

- an entire wave
- a sub-slice of a wave
- bugfixes or refinements within a completed wave

## Disallowed mindset

Do not casually pull future-wave complexity into an earlier-wave implementation unless the prompt clearly asks for it.

Examples:

- if working on shell/layout, do not invent full policy logic
- if working on policy, do not rebuild the entire visual system
- if working on FinOps, do not hardcode the whole platform around invoices only

---

# Architecture and code behavior rules

## Contracts first

Core domain contracts are extremely important.
If types/schemas/state models already exist, extend them carefully instead of replacing them.

Do not casually break:

- workflow lifecycle states
- event/timeline structures
- policy result shapes
- approval request models
- replay/audit models
- seeded scenario interfaces

If a contract must change:

- update all affected areas coherently
- keep naming intentional
- avoid half-migrated states

## Centralize important definitions

Avoid scattering critical shapes inline across the app.

Prefer centralization for:

- core types
- status enums
- risk levels
- policy outcomes
- worker identifiers
- scenario keys
- event kinds

## Avoid local hacks becoming architecture

Do not solve a missing abstraction by hardcoding one-off logic in a page component if that logic belongs in shared domain code.

## Prefer composition over duplication

If multiple pages need similar structures:

- summary cards
- timeline rows
- detail panels
- policy badges
- approval chips
- evidence panels

build or reuse shared primitives rather than duplicating markup.

---

# UI and UX rules

## Product posture

The app should feel:

- operational
- trustworthy
- high-signal
- premium
- calm under complexity

## Avoid visual chaos

Do not introduce:

- random styling directions
- inconsistent spacing logic
- duplicated badge systems
- multiple competing card/table/timeline patterns
- flashy effects that weaken clarity

## Important states must read instantly

Users should be able to quickly recognize:

- shadowed vs executed
- allowed vs blocked
- pending approval vs resumed
- low risk vs high risk
- safe scenario vs exception scenario

## Favor explainability surfaces

Where relevant, expose:

- decision reasons
- triggered rule summaries
- evidence sources
- action context
- approval rationale
- replay/event details

Do not bury critical meaning behind hover-only or obscure UI unless the prompt explicitly calls for it.

## Empty/loading/error states

Do not leave major states unhandled.
Even placeholder states should look product intentional.

---

# Domain and workflow rules

## Workers must feel distinct

If implementing worker/agent behavior, each worker should have a clear role.
Do not create fake differentiation where every worker is just the same function with a different label.

## Policy must feel concrete

Risk/policy systems should produce understandable outcomes.
Avoid vague messages like:

- “AI flagged this”
- “Risk detected”
- “Something seems unusual”

Prefer concrete language tied to data or rules.

## Approval must feel meaningful

If a human approval is requested, the UI must make clear:

- what action is being authorized
- why approval is needed
- what the risk is
- what happens next

## Replay must feel productized

Replay/audit views should not look like raw debug logs.
They should feel like first-class user-facing product surfaces.

## FinOps is the showcase, not the prison

When implementing finance-specific behavior:

- make the workflow credible
- make the scenarios high-stakes and clear
- do not entangle the entire platform irreversibly to invoice-only assumptions

---

# Demo safety rules

## Determinism over fragility

For showcase-critical functionality:

- prefer seeded fixtures
- prefer deterministic scenario launchers
- prefer predictable local state or mock orchestration
- avoid dependence on flaky external services

## Always preserve a working demo path

If a task risks breaking the main showcase flow, do not leave the branch in that state.

## Seeded scenarios are first-class

Treat curated demo scenarios as part of the product, not fake leftovers.
They should be:

- coherent
- realistic enough
- visually rich
- easy to trigger
- reliable to replay

---

# Scope control rules

## Do not overbuild

This is a hackathon product with a high bar for polish and depth, not an enterprise production rollout.
Avoid unnecessary complexity that does not improve the visible product.

## Avoid premature infrastructure work

Do not spend major effort on:

- infra-heavy abstractions
- unnecessary backend complexity
- auth/org systems beyond what the prompt needs
- deep integration plumbing that does not improve the demo

## One strong feature beats three shallow ones

If a prompt opens multiple possible paths, choose the path that strengthens the main showcase story.

---

# Editing guardrails

## Before changing existing files

First understand:

- whether the file is foundational or local
- whether the pattern already exists elsewhere
- whether a smaller modification would work

## Avoid broad rewrites by default

Do not rename or restructure large sections of the repo unless:

- the prompt explicitly asks for it
- the existing structure is clearly blocking the requested feature
- the rewrite can be completed coherently in the same pass

## Respect stable surfaces

Be cautious when touching:

- core route structure
- central layout
- core type definitions
- seeded scenarios used across pages
- shared UI component APIs

## If you must refactor

A refactor should:

- reduce complexity
- improve consistency
- preserve behavior
- not create dangling partial migrations

---

# Naming rules

Prefer names that are:

- clear
- product-oriented
- domain-legible
- reusable

Avoid names that are:

- overly clever
- vague
- temporary-sounding
- specific to a one-off hack

Examples of good naming areas:

- workers
- policy outcomes
- risk levels
- approval states
- event kinds
- scenario IDs
- summary card labels

---

# Code quality expectations

## The code should be:

- readable
- intentional
- typed where the codebase expects typing
- consistent with local patterns
- easy for later agents to build on

## Avoid:

- dead files
- commented-out junk
- duplicate components
- magic values scattered everywhere
- giant monolithic components when decomposition is obvious

## Prefer:

- focused components
- predictable props
- centralized constants
- reusable helpers
- coherent state flow

---

# Testing and validation expectations

When completing a task, validate as much as practical for the changed slice.

At minimum, aim to ensure:

- the app builds or runs
- changed routes render
- imported modules resolve
- no obvious state mismatches were introduced
- seeded scenarios still work if touched

If there are existing tests or checks in the repo relevant to the changed area, use them.

Do not invent a huge testing framework unless the prompt asks for it, but do not leave broken code behind.

---

# Expected output behavior for coding agents

When finishing a task, report clearly:

## 1. What changed

Summarize the concrete implementation completed.

## 2. Where it changed

List the main files or areas touched.

## 3. Any assumptions made

Mention assumptions that influenced the implementation.

## 4. Any follow-up risks or next best steps

Only mention real, relevant follow-ups.
Do not pad with generic recommendations.

---

# Prompt interpretation rules

## When a prompt is broad

Constrain it to the most coherent implementation slice that creates meaningful progress.
Do not try to solve the entire product in one pass.

## When a prompt is narrow

Stay narrow.
Do not opportunistically modify unrelated architecture.

## When a prompt conflicts with repo direction

Prefer the repo direction unless the prompt explicitly overrides it.

## When uncertain

Choose the option that best preserves:

- product coherence
- contract stability
- demo quality
- wave discipline

---

# Anti-patterns to avoid

## 1. Chatbot drift

Do not reduce the product to a chat interface with secondary dashboard pages.

## 2. Static-dashboard drift

Do not make the system feel like a passive analytics dashboard with no operational flow.

## 3. Finance-app drift

Do not let FinOps-specific assumptions overtake the general Aegis platform.

## 4. Invisible-magic drift

Do not hide why the system did something important.

## 5. Surface-only polish

Do not add cosmetic polish while leaving the core interaction incoherent.

## 6. Feature sprawl

Do not add weak side features that dilute the main story.

## 7. Architecture churn

Do not keep changing fundamental structures once stable contracts exist.

---

# The story every implementation should strengthen

Every meaningful implementation should support this visible narrative:

1. an AI worker begins a workflow
2. the system shows what the worker is doing
3. low-risk steps proceed smoothly
4. a risky step is detected
5. policy and risk explain the issue
6. the workflow is gated, blocked, or escalated
7. a human can review and decide
8. the system records the full chain of events
9. the run can be replayed afterward

If a change does not strengthen this story, it is probably not a priority change.

---

# Final instruction

Build Aegis like a real product with a controlled, premium, mission-control feel.

Optimize for:

- coherence
- inspectability
- trust
- demo strength
- clean vertical slices

Do not optimize for:

- feature count
- shallow novelty
- gratuitous complexity
- generic AI-app patterns
