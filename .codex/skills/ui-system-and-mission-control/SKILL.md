---
name: ui-system-and-mission-control
description: Use when working on layout, routes, shared components, dashboard patterns, or any surface that shapes the Aegis product feel. Focuses on premium mission-control UX, state clarity, and reusable UI patterns.
---

# Purpose

Use this skill when working on layout, routes, shared components, dashboard patterns, or any surface that shapes the product feel.

The UI should feel like a premium enterprise mission-control product:
calm, high-signal, operational, and trustworthy.

# Primary UI goals

The interface should make it easy to understand:

- what workflows are active
- which workers are involved
- where risk exists
- what is pending approval
- what was blocked
- how to inspect the full run afterward

The UI should emphasize control and visibility, not novelty effects.

# Product posture

Aim for:

- clean hierarchy
- strong information density without clutter
- premium panels and cards
- consistent spacing and typography
- obvious state labeling
- strong timeline and detail-view patterns

Avoid:

- gimmicky AI aesthetics
- chatbot-first layout
- consumer-app visual softness
- random one-off patterns across routes

# Core route posture

## Overview / Mission Control

Should feel like the operational center:

- active runs
- risk posture
- pending approvals
- recent events
- scenario health or launch surfaces if relevant

## Agents

Should clarify worker roles and activity, not become a settings graveyard.

## Runs / Tasks

Should expose lifecycle, worker handoffs, outcomes, and step-level detail.

## Approvals

Should feel action-oriented and high-stakes.

## Replay / Audit

Should feel inspectable and evidentiary, not like a raw log viewer.

## Policies

Should explain rules, risk thresholds, and outcomes clearly.

## FinOps Workflow

Should ground the platform in a concrete business scenario.

# Visual language rules

## State language must be instant

Users should immediately distinguish:

- shadowed vs executed
- allowed vs blocked
- pending approval vs resumed
- low risk vs high risk
- healthy workflow vs exception workflow

## Reuse consistent visual primitives

Standardize and reuse patterns for:

- status badges
- risk indicators
- worker labels
- policy chips
- approval pills
- evidence panels
- summary cards
- detail drawers or panels
- event timeline rows

Do not create parallel variants casually.

## Prioritize readable density

Enterprise does not mean cramped.
Show meaningful data, but preserve whitespace and clarity.

# Mission-control page patterns

Strong patterns for this product:

- summary stat cards
- active run list
- risk/event timeline
- approval queue preview
- worker activity panels
- scenario launcher or demo controls
- detail side panel or dedicated detail page

Weak patterns for this product:

- giant hero section
- empty marketing-style top matter
- overlong explanatory text blocks
- hidden details behind excessive clicks

# Interaction rules

- Important states should not depend only on hover
- Key actions should be obvious and nearby
- Drill-downs should preserve context
- Users should be able to move from summary to detail to decision to replay logically
- Tables should not be used where a timeline or richer card pattern is clearer

# Empty/loading/error state rules

Never leave major screens feeling unfinished.
Even placeholder states should look product-intentional.

Each major page should handle:

- empty
- loading
- populated
- exception or blocked states where relevant

# Animation and polish

Motion should support clarity:

- subtle transitions
- controlled panel opening
- clean state changes
- no flashy motion that makes the product feel toy-like

# Anti-patterns

Avoid:

- chat window as the primary interface
- inconsistent card styles across pages
- risk being communicated only by color without text
- huge tables with no prioritization
- dashboard overload with no clear hierarchy
- separate visual systems per feature area

# Done criteria

A UI implementation is strong if:

- a first-time viewer understands the product posture quickly
- the route feels connected to the rest of the app
- important states read instantly
- the screen looks enterprise-grade and demo-ready
- the user can tell what is happening without needing a narrated explanation

# Final reminder

The UI should make Aegis feel like the place where companies supervise AI workers doing real work.
Build for operational trust, not surface-level flash.
