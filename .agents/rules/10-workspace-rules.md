# OVERSCITE Workspace Rules

## Identity

- **Workspace Name**: OVERSCITE
- **Asset Domain**: Operational inspection ecosystem platform
- **Repository**: `OVERSCITE-Global`
- **Primary Stack**: Next.js 14+ / TypeScript / Firebase / Tailwind CSS
- **Governing Canon**: SCINGULAR Authority Model, BFI principles, ICB/MCB codices

## Mission

This workspace exists for bounded engineering execution in service to the OVERSCITE inspection ecosystem. All work must respect:

- The SCINGULAR Authority Model (Scing as sole intelligence operator)
- Bona Fide Intelligence (BFI) principles (transparency, trust, authenticity, human-centric)
- Zero-trust security posture via BANE governance
- Inspection domain integrity (ICB codex compliance)
- Geospatial context integrity (MCB codex compliance)
- Canon-aligned naming and architectural layering

## Required Behavior

All Antigravity operations within this workspace must:

1. **Read local docs before editing** — Check `docs/`, `legal/`, and `scing/canon/` for relevant canon.
2. **Respect folder lineage and existing structure** — Files belong where their domain affiliation is obvious.
3. **Keep diffs reviewable** — Constrain every change to the stated objective.
4. **Preserve domain language** — Use canonical SCINGULAR terminology exactly as defined.
5. **Separate implemented, provisional, experimental, and archived material** — Mark clearly in code and docs.
6. **Report what changed, why, and what remains uncertain** — Use the standardized report format from `30-reporting.md`.
7. **Validate after changes** — Run relevant build, lint, or runtime checks.
8. **Preserve governance comments** — Do not remove comments that express architectural boundaries.

## Forbidden Behavior

All Antigravity operations within this workspace must never:

1. **Rename canonical terms casually** — BANE, SRT, LARI, AIP, ISDC, Scing, ARC, OVERSCITE, TEON, WIRM™, D-STORE, STORB, ORB, ORE, EAB, GALAX-E, Scavatar must retain canonical names and casing.
2. **Collapse architecture layers** — Keep Scing (interface), ScingOS (operating layer), and SCINGULAR AI (backend) distinct.
3. **Silently rewrite broad repo surfaces** — Do not roam or opportunistically refactor unrelated files.
4. **Infer approval for security, auth, compliance, or authority changes** — Escalate to Director for high-sensitivity surfaces.
5. **Present speculative systems as implemented systems** — Distinguish clearly between designed and built.
6. **Introduce new dependencies casually** — Every dependency is a governance and maintenance burden.
7. **Hardcode secrets, tokens, credentials, or private endpoints.**
8. **Expose internal-only data to client surfaces without explicit approval.**
9. **Silently broaden permissions, autonomy, or sensor reach.**

## Local Boundary Locks

See [20-boundaries.md](20-boundaries.md) for the full set of OVERSCITE-specific domain boundaries, sensitive surfaces, and escalation surfaces.

## Required Report Format

See [30-reporting.md](30-reporting.md) for the standardized report structure that must conclude every major task.
