---
name: finops-workflow-scenarios
description: Use when implementing the FinOps and back-office showcase layer ":" invoice flows, vendor checks, PO matching, exception handling, payment-intent review, and scenario-specific copy or data.
---

# Purpose

Use this skill when implementing the FinOps or back-office showcase layer:
invoice flows, vendor checks, PO matching, exception handling, payment intent review, and scenario-specific copy or data.

This skill grounds the Aegis platform in a high-stakes business workflow.

# Goal

Make the value of Aegis obvious through a concrete workflow where:

- automation is desirable
- mistakes are costly
- approvals are normal
- policy and risk logic feels necessary
- replay and audit feel important

FinOps is the first showcase because it naturally exposes those tensions.

# Core workflow

A credible demo flow should cover:

1. invoice intake
2. vendor resolution
3. purchase-order or amount verification
4. policy and risk review
5. exception detection
6. approval routing if required
7. controlled execution or block
8. replay or receipt closure

# Scenario design rules

Every scenario should have:

- a clear business context
- a clear reason for its risk posture
- enough artifacts to make the run believable
- enough detail to support replay and approval context
- a predictable, deterministic flow for demo use

# High-value seeded scenarios

Prioritize strong cases such as:

## 1. Safe invoice

Trusted vendor, matching PO, expected amount, complete documentation.
This shows the happy path and controlled autonomy.

## 2. Unknown vendor

Vendor is missing from registry or unresolved.
This shows identity uncertainty and escalation.

## 3. Invoice mismatch

Amount or line items do not align with PO or expected record.
This shows policy and risk reasoning.

## 4. Bank detail change

Vendor bank details changed recently.
This is a high-stakes, highly demoable halt condition.

## 5. Missing documentation

Critical document absent or incomplete.
This creates a clean pause or block state.

## 6. Hard policy violation

A clear rule should stop the run.
This is useful for proving that the system has boundaries.

# Domain realism rules

The goal is credible realism, not accounting-software completeness.

Include enough domain detail to feel real:

- invoice IDs
- vendor names
- PO references
- amount differences
- document status
- risk notes
- approval thresholds

Do not try to model a full ERP.

# Product relationship rule

FinOps is the showcase layer, not the whole identity of the codebase.

When implementing finance-specific functionality:

- keep generic platform concepts generic
- isolate domain-specific rules and fixtures where practical
- do not let every shared abstraction become invoice-specific

# UX expectations

The FinOps layer should help a judge instantly understand:

- what the workflow is
- why this is risky if done wrong
- why Aegis is useful here
- how the control-plane behavior changes outcomes

Use domain language that is clear but not overloaded with jargon.

# Anti-patterns

Avoid:

- turning the app into a generic accounting dashboard
- too many shallow scenarios instead of a few strong ones
- abstract business language with no concrete artifact examples
- hardcoding finance assumptions into all platform types

# Done criteria

A FinOps pass is strong if:

- the scenario is instantly legible
- the risks feel meaningful
- policy, approval, and replay become easier to understand through the domain
- the platform identity of Aegis remains intact
- the seeded paths are demo-safe and visually rich

# Final reminder

The purpose of FinOps here is not to build a finance product.
It is to showcase why AI workers need control, trust, and oversight.
