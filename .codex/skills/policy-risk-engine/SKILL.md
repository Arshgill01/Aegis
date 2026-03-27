---
name: policy-risk-engine
description: Use when implementing rule evaluation, permission checks, risk scoring, decision outcomes, or policy explanation surfaces. Focuses on concrete, inspectable allow, escalate, and block behavior.
---

# Purpose

Use this skill when implementing rule evaluation, permission checks, risk scoring, decision outcomes, or policy explanation surfaces.

This is one of the core differentiators of Aegis.

# Goal

For any meaningful action, the system should be able to say:

- whether it is allowed
- whether it should be logged with emphasis
- whether it requires approval
- whether it is blocked
- why that decision was reached

# Policy design rules

## Policy outcomes must be concrete

Prefer outcomes like:

- allowed
- allowed_with_attention
- requires_approval
- blocked

Avoid vague outputs like:

- caution
- maybe risky
- unusual AI decision

## Risk should be understandable

Risk is not just a badge.
It should connect to:

- thresholds
- policy triggers
- evidence
- action sensitivity
- permission scope

## Policy should feel rule-grounded

The user should understand the specific reason for concern.

Good examples:

- vendor not found in approved registry
- invoice total exceeds approval threshold
- bank account changed within last 14 days
- invoice amount mismatches purchase order
- payment action exceeds worker scope
- required supporting document missing

Bad examples:

- AI detected anomaly
- system feels uncertain
- suspicious behavior without context

# Permission model rules

Permissions should matter.
A worker should not appear able to do everything.

Permission checks can relate to:

- action type
- workflow stage
- dollar threshold
- document class
- execution mode
- approval prerequisites

# Explanation rules

For each important decision, expose:

- outcome
- triggered rules
- severity or risk level
- concise rationale
- relevant evidence or artifact reference where possible

Do not make explanation surfaces depend only on debug data.

# UX expectations

Users should be able to inspect:

- what rule fired
- which action it affected
- why the result was allow, escalate, or block
- what would be needed to proceed

The policy layer should feel like a first-class operational feature, not invisible middleware.

# Implementation posture

Prefer:

- centralized rule definitions or coherent evaluation logic
- typed result objects
- reusable explanation formatting
- compatibility with approvals and replay

Avoid:

- scattering business rules inside many page components
- magic thresholds repeated inline
- one-off policy behavior for a single screen only

# Anti-patterns

Avoid:

- opaque risk scores with no explanation
- too many rules with overlapping language and no hierarchy
- policy labels that users cannot act on
- generic “AI flagged this” copy
- making all risky actions equally severe

# Done criteria

A policy/risk pass is strong if:

- actions visibly route through policy evaluation
- decisions are understandable
- approval and block paths are meaningful
- permissions influence outcomes credibly
- replay and audit can show what policy happened and why

# Final reminder

Aegis wins by making autonomous work trustable.
Policy and risk must feel concrete, inspectable, and productized.
