---
name: agent-orchestration
description: Use when implementing worker roles, run progression, task assignment, handoffs, shadow mode, or execution sequencing. Focuses on visible AI-worker orchestration that remains legible and replayable.
---

# Purpose

Use this skill when implementing worker roles, run progression, task assignment, handoffs, shadow mode, or execution sequencing.

This skill makes Aegis feel like a real AI-worker control system rather than a static dashboard.

# Goal

Represent AI workers as visible operational actors in a workflow.

Users should be able to tell:

- which worker is active
- what that worker is responsible for
- when handoffs happen
- whether the run is shadowed or executing
- where the workflow paused, failed, or escalated

# Worker design rules

## Workers should have distinct roles

Do not create multiple workers that are functionally identical except for the label.

Good examples:

- Intake Worker
- Document Review Worker
- Policy Review Worker
- Risk Worker
- Approval Coordinator
- Execution Worker
- Audit Narrator

## Workers should fit the product story

Workers are part of the control-plane narrative.
They should feel credible and inspectable, not decorative.

# Orchestration rules

## Workflow progression should be legible

A run should feel like a sequence of meaningful stages.
Avoid jumps that make it unclear how the system got from one point to another.

## Handoffs matter

When work moves between workers, that should be surfaced.
This is part of what makes the system feel agentic.

## Shadow mode and execution mode must be distinct

The system must preserve the difference between:

- what the agent proposes or simulates
- what is actually executed

That difference should be represented in both data and UI.

## Failure and pause states should not break narrative clarity

A blocked or paused run is not a broken run.
It is often the most important state in the product.

# Implementation posture

When implementing orchestration:

- prefer explicit state transitions
- keep run lifecycle inspectable
- represent worker ownership of steps clearly
- preserve compatibility with policy, approval, and replay layers

Do not bury core orchestration logic inside view-only components if it is reused across the product.

# What strong orchestration looks like

A reviewer should be able to follow:

1. the workflow starts
2. a worker takes first responsibility
3. steps progress in sequence
4. responsibility shifts where appropriate
5. a risk or policy concern interrupts or gates the flow
6. the run either resumes, halts, or completes
7. the whole path remains visible afterward

# Anti-patterns

Avoid:

- one giant “agent” abstraction that hides all role differences
- timeline events with no visible actor
- runs that jump between states without context
- execution logic so magical that replay becomes shallow
- worker systems that exist only as labels in the UI

# Done criteria

An orchestration pass is strong if:

- multiple workers are visibly meaningful
- run progression is understandable
- shadow vs execution mode is preserved
- blocked, approval-needed, and completed states fit the same lifecycle story
- replay and audit layers can build on the event history cleanly

# Final reminder

Aegis is about controlling AI workers.
The workers must feel real enough to supervise.
