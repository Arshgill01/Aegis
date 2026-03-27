---
name: approval-flow
description: Use when implementing approval queues, reviewer actions, intervention points, pause-resume behavior, or high-risk human-in-the-loop UX. Focuses on making approval moments specific, contextual, and operational.
---

# Purpose

Use this skill when implementing approval queues, reviewer actions, intervention points, pause-resume behavior, or high-risk human-in-the-loop UX.

Approval is not a decorative feature in Aegis.
It is one of the key moments where the product proves its value.

# Goal

When a risky action occurs, Aegis should:

- pause or gate execution
- create a clear approval request
- explain what is being authorized
- let a human approve, reject, or intervene
- preserve that decision in the run history

# Approval design rules

## Approval requests must be specific

An approval request should make clear:

- what action is proposed
- who or which worker proposed it
- why approval is needed
- what the risk is
- what evidence is relevant
- what happens if approved or rejected

## Approval is contextual, not generic

Do not present approvals as empty yes or no forms.
The reviewer should be able to understand the situation without guessing.

## Human action should affect workflow state visibly

Approval should change the run, not just flip a badge.

# Typical approval actions

Support meaningful operations such as:

- approve
- reject
- request changes or needs more review
- intervene or stop workflow
- escalate to another reviewer if the product surface supports it

Not every task needs all of these, but the flow must feel operational.

# UX expectations

Approval surfaces should support:

- queue view
- detail view
- risk summary
- evidence or context panel
- action buttons
- decision history

The user should be able to move from “why is this here?” to “I’m comfortable deciding” quickly.

# Workflow rules

Approvals should integrate with run lifecycle:

- pending approval
- approved and resumed
- rejected
- blocked or cancelled after intervention

Do not make approvals feel disconnected from the actual workflow run.

# Anti-patterns

Avoid:

- approval rows with no context
- action buttons without consequence visibility
- forcing the user to open many screens just to understand basic risk
- approvals that are visually buried
- decisions that do not clearly update the workflow story

# Done criteria

An approval pass is strong if:

- escalated steps produce clear approval items
- reviewers can understand the risk and action
- approval decisions visibly affect run state
- rejected and resumed paths are both coherent
- the feature strengthens the main demo story

# Final reminder

The best approval experience in Aegis should make the reviewer feel:
“the agent got far on its own, and this is the exact moment where human judgment matters.”
