---
name: audit-replay-explainability
description: Use when implementing event history, replay views, decision receipts, evidence panels, or explanation surfaces tied to workflow runs. Focuses on making Aegis inspectable, replayable, and audit-friendly.
---

# Purpose

Use this skill when implementing event history, replay views, decision receipts, evidence panels, or explanation surfaces tied to completed or in-progress runs.

This is the layer that turns Aegis from a flashy workflow demo into a trustworthy system of record.

# Goal

A reviewer should be able to inspect a run and answer:

- what happened
- in what order
- which worker acted
- what policy applied
- whether approval was required
- what evidence informed the outcome
- whether the action was simulated or executed

# Replay design rules

## Replay should be human-readable

It should feel like a product feature, not raw debug output.

## Replay should preserve sequence

The user must be able to reconstruct the workflow narrative from the event stream.

## Important events need rich detail

For key steps, support context like:

- actor or worker
- action
- affected artifact
- decision outcome
- risk or policy context
- approval state
- execution mode
- timestamp or order marker

# Audit and receipt rules

A run should support a concise audit or receipt surface that summarizes:

- run identity
- workflow type or scenario
- workers involved
- decision highlights
- approvals
- blocked or escalated steps
- final outcome

The receipt should make the run feel reviewable and exportable in spirit, even if the hackathon version keeps it lightweight.

# Explainability rules

“Why” surfaces should be available where needed:

- why a policy blocked something
- why approval was required
- why a run resumed or halted
- what evidence changed the decision posture

Avoid explanation copy that simply restates the label.

Bad:
“Blocked because blocked.”

Good:
“Blocked because the invoice amount exceeds the allowed threshold and the vendor bank details changed within the last 14 days.”

# UI expectations

Useful patterns:

- timeline view
- event list with expandable details
- side panel for event context
- receipt or summary card
- shadow vs execution comparison
- evidence references near the relevant event

Avoid:

- giant unstructured logs
- too much hidden behind separate pages
- explanation buried so deeply that it loses product value

# Anti-patterns

Avoid:

- replay that only shows timestamps and labels
- audit view that duplicates the run page with no added clarity
- long walls of text instead of structured explanation
- raw internal IDs or debug jargon in the user-facing surface

# Done criteria

A replay or audit pass is strong if:

- a first-time viewer can reconstruct the workflow history
- key decisions are inspectable
- receipts summarize outcomes cleanly
- shadow vs executed distinctions are preserved
- the feature makes the product feel significantly more serious

# Final reminder

Most hackathon projects show that something happened.
Aegis should also show why it happened and why it was safe or stopped.
