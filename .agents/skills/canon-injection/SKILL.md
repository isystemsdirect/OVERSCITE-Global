---
name: Canon Injection
description: Translate approved canon into code, docs, naming, structure, and UI surfaces without collapsing architectural layers.
---

# Canon Injection Skill

## Purpose

Translate approved SCINGULAR canon into implementation artifacts — code, documentation, naming, structure, and UI surfaces — while preserving architectural layer separation, canonical naming, and governance boundaries.

## When to Use

- Implementing features defined by canonical specifications (AIP, ISDC, ICB, MCB, BANE)
- Aligning existing code with updated canon
- Enforcing naming conventions from authoritative documents
- Building UI surfaces that must reflect canonical authority or terminology
- Creating typed interfaces that mirror canonical data structures

## Rules

1. **Preserve canonical names exactly** — Do not simplify, abbreviate, or synonym-ize canonical terms.
2. **Do not broaden scope** — Implement only what the canon specifies; do not anticipate extensions.
3. **Distinguish implemented vs. proposed** — Mark code that implements approved canon differently from speculative/provisional code.
4. **Do not silently reinterpret doctrine** — If canon is ambiguous, flag the ambiguity rather than picking an interpretation.
5. **Preserve layer separation** — Scing (interface) ≠ ScingOS (OS layer) ≠ SCINGULAR AI (backend). Never collapse.
6. **Respect authority flow** — User Intent → Scing Neural Arbitration → Ecosystem Execution → Scing Neural Validation → SRT State Expression → User Perception.

## Steps

1. **Identify the canonical source** — Locate the authoritative document(s) for the feature being implemented.
2. **Extract implementation requirements** — List specific names, types, flows, constraints, and boundaries.
3. **Map to target surfaces** — Identify which source files, components, or docs will be affected.
4. **Implement with explicit canon references** — Add comments linking implementation to canon source.
5. **Verify naming alignment** — Check all new identifiers against canonical terminology.
6. **Verify boundary integrity** — Confirm no architectural layers were collapsed.
7. **Validate** — Run available checks (build, lint, types, runtime).

## Deliverables

- **Aligned files** — Modified or new files implementing the canon
- **Concise report** — Following the format in `.agents/rules/30-reporting.md`
- **Risk notes** — Any concerns about interpretation, boundary, or scope
