# Chapter 18 — Quick Start Guide

*Volume 10: Quick Start & Reference | OVERSCITE Global User Manual*

---

## Your First Five Minutes in OVERSCITE

This chapter is designed for operators who need to be productive immediately. It covers the five essential steps that take you from login to operational readiness.

---

## Step 1: Authenticate and Orient

**What to do**: Sign in with your provided credentials. After authentication, you will see the OVERSCITE shell — the persistent interface that wraps every page in the platform.

**What you will see**:

```
┌──────────────────────────────────────────────────────────┐
│  [≡]  │    ✦ OVERSCITE Global · Ready    │  [🔔] [HUD]  │  ← Top Command Bar
├───┬───┴──────────────────────────────────┴──┬────────────┤
│   │                                         │            │
│ S │                                         │  OverHUD   │
│ i │          Main Content Area              │  (optional) │
│ d │                                         │            │
│ e │          Your current page              │            │
│ b │          loads here                     │            │
│ a │                                         │            │
│ r │                                         │            │
│   │                                         │            │
└───┴─────────────────────────────────────────┴────────────┘
```

**Key landmarks**:
- **Sidebar** (left): Your navigation menu — click any item to go to that section
- **Scing Bar** (top center): The gold-accented bar that says "OVERSCITE Global · Ready" — this is how you talk to Scing
- **OverHUD toggle** (top right): Opens the intelligence panel on the right side

---

## Step 2: Meet the Scing Panel

**What to do**: Click the Scing Bar in the top center of the screen. It will expand downward into a conversational panel.

**What you will see**: A panel with a message history area and a text input at the bottom. This is where you communicate with Scing — the system's conversational coordinator.

**Try it now**: Type "What can you help me with?" and press Enter. Scing will respond with an overview of available capabilities.

**Key principles**:
- Scing is where you *ask* and the system *responds*
- It maintains context across multiple messages in a session
- Close it by clicking the X button or clicking outside the panel
- It does not display security alerts — those go to the OverHUD

---

## Step 3: Explore the OverHUD

**What to do**: Click the OverHUD toggle button (usually an eye or shield icon) in the top-right utility area.

**What you will see**: A full-height panel slides open on the right side. It displays:
- Security status and recent BANE activity
- System health indicators
- Environment information (development/staging/production)

**Key principle**: The OverHUD is for *observation*. It shows you what is happening in the system without requiring your input. Check it when you want to verify system health or review security activity.

---

## Step 4: Navigate to Your Primary Tool

**What to do**: Using the sidebar, click on the route most relevant to your role:

| If you are... | Go to... |
|---------------|----------|
| An inspector preparing for fieldwork | **Weather** (check conditions) → **Inspections** (review schedule) |
| A team manager | **Dashboard** (operational overview) → **Teams** (team status) |
| Reviewing inspection results | **Inspections** (find the record) → Open specific inspection |
| Managing contractors | **Contractor** (party management and oversight) |
| Handling scheduling | **Calendar** (booking management) |
| Need financial visibility | **Finances** (billing and subscription status) |

**What you will see**: Each page has a **Page Identity Band** immediately below the command bar showing:
- The page name
- A four-sentence description of what it does
- A truth-state badge indicating its implementation maturity

---

## Step 5: Understand the Truth-State System

**What to do**: Look for truth-state badges as you navigate. They appear in Page Identity Bands, data panels, and status indicators throughout the platform.

| Badge | Meaning | Your Action |
|-------|---------|-------------|
| **[LIVE]** | Real data, fully operational | Use with confidence |
| **[FUNCTIONAL MVP]** | Real logic, some simulated data | Use for core work, expect some limitations |
| **[PARTIAL]** | Architecture complete, pending integration | Explore, but don't rely for decisions |
| **[MOCK]** | Visual demonstration, synthetic data | Understand the structure, not the data |
| **[DEFERRED]** | Placeholder for future capability | Acknowledge and move on |

**Key principle**: If you remember one thing from this manual, remember this — OVERSCITE never hides its maturity state. Every surface tells you how real it is.

---

## What to Do Next

You are now oriented. From here:

1. **Read Chapter 1** for a complete understanding of what OVERSCITE is
2. **Read Chapter 5** if you want to master the Scing Panel and OverHUD
3. **Read Chapter 11** if you are an inspector who will use the inspection workflow
4. **Read Chapter 7** if environmental safety intelligence is central to your work
5. **Consult the Glossary** (Chapter 19) for any OVERSCITE term you don't recognize

---

## Quick Reference Card

| Action | How |
|--------|-----|
| Open Scing Panel | Click the Scing Bar (top center) |
| Close Scing Panel | Click X button or click outside |
| Open OverHUD | Click HUD toggle (top right) |
| Navigate to a route | Click sidebar link |
| Ask Scing a question | Open Scing Panel → type → press Enter |
| Check weather risk | Navigate to Weather → read IRI panel |
| See system security | Open OverHUD → read Security tab |
| Find a specific term | See Chapter 19 — Reference Glossary |

---

*Previous: [Chapter 17 — Known Limitations](../vol-09-user-responsibility/ch17-limitations.md)*  
*Next: [Chapter 19 — Reference Glossary](ch19-reference-glossary.md)*
