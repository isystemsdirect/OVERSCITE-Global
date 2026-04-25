# ScingOS UI/UX Design Specification
**Status:** Scaffolded — April 24, 2026 | **Authority:** Director Teon G. Anderson, ISD LLC
**Maintained by:** Scing-Puble (Puble), SCING Operating System

> Full canonical design spec lives at `/docs/SCINGOS_UIUX.md`. This root file serves as the authoritative stub and summary reference.

---

## Brand Identity

| Element | Value |
| :--- | :--- |
| **Primary Brand** | OVERSCITE Global ™ |
| **Parent System** | SCING Operating System (SOS) |
| **Brand Colors** | Emerald Green (#00A550 or darker), Navy Blue (#1B3A6B), Neon Golden Yellow (#FFD100) |
| **Checkmark Color** | Neon Golden Yellow — used exclusively on OVERSCITE shield mark |
| **Logo Usage** | Official OVERSCITE shield logo ONLY — no generic AI or stock imagery |
| **Typography Direction** | Professional, authoritative, clean. Geometric sans-serif primary. |

---

## Core Design Principles

1. **Trust First** — Every surface must communicate authority, accuracy, and verifiability. OVERSCITE is an inspection and verification instrument, not a consumer app.
2. **Role-Aware Display** — What a user sees is governed by their clearance tier. UI adapts to role without breaking visual continuity.
3. **Minimal but Dense** — Field professionals need fast, information-rich interfaces. Beauty serves function; nothing is decorative.
4. **Verification at Every Step** — Audit trail, seal status, and document authentication state should be visible, not buried.
5. **Transparent State** — No hidden loading states, no ambiguous statuses. Every element must truthfully represent its current condition.

---

## Screen Flow Architecture

### Primary Navigation
- `/` — Dashboard (Functional Shell)
- `/inspections` — Inspection Workflow (Functional MVP)
- `/library` — Document Library (Functional MVP)
- `/calendar` — Scheduling (Functional MVP)
- `/finances` — Billing & Finance (Functional MVP)
- `/messaging` — Messaging (Bounded Shell — In Progress)
- `/marketplace` — Capability Registry (Bounded Shell)
- `/admin` — Admin Panel (Deferred Shell)
- `/community` — Community (Deferred Shell)
- `/verify` — **[PLANNED]** Document Authentication & Verification Portal

---

## Document Authentication UI (Planned — `/verify`)

This is a critical planned surface. Full specification to be created at `/specs/DOCUMENT-AUTH-SPEC.md`.

**Input Modes:**
- String entry (auth code lookup) → pop-up splash result
- Photo upload (OCR + hash verification)
- PDF upload (field extraction + database comparison)
- Printer scan upload (image processing + verification)

**Result Display Rules:**
- Unauthenticated / Low Clearance: Findings only. No notes, no internal commentary, no protected attachments.
- Authorized / Origin Clearance: Full verification detail, discrepancy flags, revision history, evidentiary metadata.
- Issuer Identity: Display Issuer Tag ID only. Personal name shown ONLY if issuer is a freelance operator under their own legal/trade business name.

**Auth String Format (Proposed):** `OVG-[YY]-[REGION]-[CLASS]-[RANDOM4]-[RANDOM4]-[CHECK]`
Example: `OVG-26-MN-CI-7Q4K-92XF-A13`

**Verification States:**
- ✅ Authentic and Current
- ⚠️ Authentic but Superseded
- 🔴 Authentic but Altered Copy Detected
- ❌ Record Not Found
- 📷 Insufficient Image Quality
- 🔒 Restricted — Limited Disclosure (Clearance Required)

---

## Authentication Rail Design

Every issued OVERSCITE report must carry a vertical authentication rail on the upper-left edge of the document containing:
- Vertical OVERSCITE wordmark/shield
- Authentication string (human-readable)
- QR Code or Data Matrix (machine-readable)
- Document status badge: Original | Certified Copy | Superseded | Revoked

---

## Component Standards (To Be Expanded)

- **Buttons:** Navy Blue primary / Emerald Green secondary / Ghost for tertiary actions
- **Status Badges:** Color-coded by finding severity (Pass / Monitor / Deficient / Critical)
- **Cards:** Surface elevation with subtle shadow; no colored side borders
- **Tables:** `tabular-nums` for all numeric data; sortable columns; row-level status indicators
- **Forms:** Label above input; inline validation; no multi-column form layouts in field view
- **Modals:** Overlay with context preserved; always include title + dismiss action
- **Empty States:** Never blank; always include message, action CTA, and visual mark

---

## Responsive Targets

| Breakpoint | Device Class | Notes |
| :--- | :--- | :--- |
| 375px | Mobile (field use) | Primary design target for inspectors in the field |
| 768px | Tablet | Dashboard and report review |
| 1280px+ | Desktop | Admin, report generation, system management |

---

## Accessibility Standards

- WCAG AA minimum — 4.5:1 body text contrast, 3:1 large text
- All interactive elements keyboard-navigable
- Minimum 44x44px touch targets for field/mobile use
- Semantic HTML throughout (`<header>`, `<main>`, `<section>`, etc.)
- `aria-label` on all icon-only controls
- `prefers-reduced-motion` respected

---

## Outstanding UI/UX Build Items

| Item | Priority | Status |
| :--- | :--- | :--- |
| `/verify` Document Authentication Portal (full screen flow) | CRITICAL | ❌ Not built |
| Full design token CSS file (OVERSCITE brand palette) | HIGH | ❌ Not formalized |
| Component library / Storybook | MEDIUM | ❌ Not started |
| Dark mode implementation | MEDIUM | ❌ Not confirmed |
| Mobile-first field inspection view | HIGH | ⏳ In progress via `/inspections` |
| OVERSCITE shield logo integration across all surfaces | HIGH | ❌ Not confirmed |

---

*This document is a living specification. All updates require Director authorization.*
*Inspection Systems Direct LLC | SCING Operating System | OVERSCITE Global ™*
