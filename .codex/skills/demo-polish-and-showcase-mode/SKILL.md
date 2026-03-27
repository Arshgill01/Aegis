---
name: demo-polish-and-showcase-mode
description: Use when building final demo states, seeded scenario launchers, showcase controls, screenshot-ready surfaces, or final product polish. Focuses on deterministic presentation quality and stable demo flow.
---

# Purpose

Use this skill when building final demo states, seeded scenario launchers, showcase controls, screenshot-ready surfaces, or final product polish.

This skill exists because a hackathon winner needs not just a good product, but a reliable and impressive presentation surface.

# Goal

Make Aegis demo-safe, visually intentional, and easy to present under pressure.

The product should support:

- deterministic seeded scenarios
- quick transitions into showcase states
- screenshot or video-friendly surfaces
- no confusing dead ends during the demo
- stable high-signal routes for judges

# Core demo principles

## Determinism beats realism

For showcase-critical paths, prefer predictable fixtures and state over fragile live behavior.

## One strong path beats many weak ones

The demo should make a few moments feel inevitable and polished.

## Every important screen should look finished

This includes:

- empty states
- loading states
- blocked states
- approvals
- replay
- scenario detail views

# Showcase mode patterns

Useful surfaces may include:

- seeded scenario launcher
- reset demo data action
- quick-open into risky scenario
- highlighted approval-needed run
- replay-ready completed run
- mission-control overview with active story signals

These do not need to be called “demo mode” publicly if that weakens the product feel, but the capability should exist.

# Polish priorities

Focus polish on:

- hierarchy clarity
- spacing consistency
- interaction smoothness
- visual alignment
- state readability
- route completeness

Not on:

- feature count
- novelty motion
- unnecessary settings
- deep customization

# Submission-oriented considerations

A good final build should make it easy to:

- capture polished screenshots
- record a stable demo
- explain the product quickly
- navigate between hero moments without friction

Implementation that helps those goals is real product work for this repo.

# Anti-patterns

Avoid:

- adding last-minute side features
- major refactors late in the build
- relying on manual data setup before every demo
- visually polished pages sitting next to obviously unfinished pages
- leaving broken routes or obvious placeholder junk in primary flows

# Done criteria

A polish or demo pass is strong if:

- the main story can be shown smoothly
- seeded scenarios are easy to trigger
- the product looks intentionally complete
- key screens are screenshot-ready
- judges can move through the app without confusion

# Final reminder

Polish in Aegis is not decoration.
It is what turns a strong build into a convincing winner-grade demo.
