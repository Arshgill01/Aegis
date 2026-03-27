---
name: domain-modeling-and-fixtures
description: Use when defining types, schemas, seeded fixtures, scenario data, workflow states, or simulated execution records. Focuses on stable contracts, deterministic demo data, and replay-friendly domain modeling.
---

# Purpose

Use this skill when defining types, schemas, seeded fixtures, scenario data, workflow states, or fake or simulated execution records.

This skill is about creating the internal language of Aegis.

# What needs stable contracts

The following concepts should become stable early and change only when necessary:

- worker identity
- workflow run
- step lifecycle
- tool invocation
- policy rule
- risk assessment
- approval request
- approval decision
- event stream item
- replay frame
- execution receipt
- domain artifacts like invoice, vendor, PO, and payment intent

# Modeling philosophy

## Prefer explicitness

Use names and shapes that make the domain understandable.
Do not hide important distinctions in vague fields.

## Prefer centralization

Keep important types and enums in predictable shared locations.
Avoid redefining the same shape inline in many components.

## Model product concepts, not raw implementation accidents

A WorkflowRun should represent the product concept, not whatever the current UI happened to need in one component.

# Core modeling rules

## Workflow lifecycle should be explicit

Use clear states for runs and steps.
Examples:

- queued
- planning
- running
- waiting_for_approval
- blocked
- completed
- failed
- cancelled

## Distinguish simulation from execution

This product depends on shadow vs executed behavior.
That distinction should be visible in the data model.

## Events should be replay-friendly

Event shapes should support:

- ordered rendering
- actor or worker identity
- time markers
- status transitions
- evidence or artifact references
- policy and approval references when relevant

## Risk should not be just a number

Support both:

- a normalized or severity representation
- the reasons or factors behind it

## Approval objects should carry context

An approval request should not just store “approved = false”.
It should carry:

- the action in question
- the risk context
- the trigger reason
- the reviewer role or assignee if applicable
- the decision trail

# Fixture strategy

## Fixtures are first-class

Seeded data is not throwaway.
It powers the demo and should be realistic enough to tell a coherent story.

## Prefer curated scenarios over generic samples

Better:

- safe invoice from trusted vendor
- invoice mismatch with PO
- bank detail change before payment
- unknown vendor
- missing documentation

Worse:

- many random fake entries with no narrative value

## Determinism matters

Fixtures should be stable and repeatable.
Do not generate critical demo states in a way that changes unpredictably.

# Scenario design rules

Every seeded scenario should have:

- a clear goal
- a clear risk posture
- a plausible business context
- a coherent event history
- obvious reasons for allow, escalate, or block behavior
- enough detail to make replay and audit interesting

# Recommended entity set

At minimum, expect to work with concepts like:

- AgentWorker
- WorkflowRun
- TaskStep
- ToolInvocation
- PolicyRule
- RiskAssessment
- ApprovalRequest
- ApprovalDecision
- AuditEvent
- ReplayFrame
- ExecutionReceipt
- Invoice
- Vendor
- PurchaseOrder
- PaymentIntent
- ExceptionCase

Exact names can vary with codebase conventions, but the conceptual set should remain clear.

# Anti-patterns

Avoid:

- anonymous object blobs passed page-to-page
- multiple competing status enums for the same concept
- fixture records that look realistic individually but tell no coherent story
- hardcoding domain values in UI components when they belong in fixtures or constants
- over-normalizing simple hackathon data structures until they become painful to work with

# Done criteria

A modeling or fixture pass is strong if:

- the contracts are readable and reusable
- later waves can build on them without reinvention
- seeded scenarios clearly support the demo story
- the UI can render meaningful detail from the models
- the difference between safe and risky flows is obvious in the data

# Final reminder

Aegis needs data structures that make policy, approval, replay, and audit feel inevitable.
Model for inspectability, not just for rendering.
