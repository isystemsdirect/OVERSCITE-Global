# Chapter 5 — The Panel System

*Volume 3: Interface Operations | OVERSCITE Global User Manual*

---

## 5.1 Two Panels, Two Purposes

The OVERSCITE interface organizes its intelligence surfaces into two distinct panels: the **Scing Panel** and the **OverHUD**. Understanding the difference between them — and why they exist as separate surfaces — is essential to using the platform effectively.

The simplest way to understand the distinction:

- **The Scing Panel is where you talk.** It is the active, interactive conversational surface where you make requests, ask questions, and receive responses from Scing.

- **The OverHUD is where you observe.** It is the passive, always-available intelligence surface that displays system status, security alerts, and environmental awareness data without requiring your direct interaction.

This separation is not arbitrary. It reflects a core architectural principle: **interactive intelligence and passive observation must never share the same surface.** Mixing conversational interaction with security alert feeds would create cognitive overload, blur the boundary between what you asked for and what the system is telling you unprompted, and make it impossible to reconstruct the audit trail of a conversation.

---

## 5.2 The Scing Panel

### Location and Behavior

The Scing Panel occupies the center of the **Top Command Bar** — the fixed horizontal bar at the top of every authenticated page. It has two states:

**Collapsed State**: A compact horizontal bar approximately 44 pixels tall displaying:
- The Scing icon (left)
- The workspace name (center, e.g., "OVERSCITE Global")
- The operational status indicator ("Ready", "Thinking...", etc.)
- A click/tap target that triggers expansion

**Expanded State**: A drop-down panel that extends downward from the command bar, occupying **450 pixels of width** and up to **640 pixels of height**. The expanded panel contains:
- **Header Bar**: Scing identity, workspace name, session indicator, and a close button
- **Messages Area**: Scrollable conversation history showing user messages and Scing responses
- **Prompt Input**: A text input field at the bottom where you type requests

The expansion is animated with a smooth slide-down transition (300ms, ease-out), creating a visual connection between the collapsed bar and the full conversational surface.

### What Belongs in the Scing Panel

The Scing Panel is strictly scoped to **interactive conversational functions**:

- Asking questions ("What code applies to this building type?")
- Requesting actions ("Generate the inspection report")
- Receiving Scing responses (text, structured responses, suggestions)
- Reviewing conversation history within the current session
- Confirming or rejecting Scing proposals ("Yes, proceed" / "No, cancel")
- Multi-turn dialogue with context continuity

### What Does Not Belong in the Scing Panel

The following content types are **prohibited** in the Scing Panel — they belong in the OverHUD:

- BANE security alert feeds
- System health monitoring dashboards
- Repository status indicators
- Passive notification streams
- Event log tickers
- Defender/threat event displays
- Performance metrics or telemetry

This prohibition is enforced by the component's docblock role lock and maintained as a disciplinary boundary during development. The rationale is that mixing proactive security alerts into a conversation stream would:
1. Create false urgency during routine work
2. Break conversational context
3. Make it impossible to read back a conversation without encountering unrelated system alerts
4. Violate the distinction between operator-initiated interaction and system-initiated observation

### How to Use the Scing Panel

**Opening**: Click the Scing Bar in the center of the Top Command Bar. The panel drops down.

**Typing a request**: Focus the prompt input and type your request. Press Enter or click the send button to submit.

**Reading responses**: Scing's responses appear in the messages area, attributed to "Scing" with a distinct visual style. If the response includes structured data (a table, a code reference, or a risk score), it is rendered inline within the conversation.

**Multi-turn conversations**: Scing maintains context across multiple messages within a session. You can ask follow-up questions that reference previous turns without repeating context.

**Closing**: Click the close button in the header bar, or click outside the panel. The panel slides up and returns to its collapsed state.

---

## 5.3 The OverHUD

### Location and Behavior

The OverHUD (Operational Verification Heads-Up Display) is a **full-height panel** that occupies the right side of the application when expanded. It exists as a sibling to the main content area — when the OverHUD opens, the main content region narrows to accommodate it.

**Default State**: The OverHUD can be toggled open or closed. Its state persists through the `ShellLayoutProvider` context, so it remains consistent as you navigate between routes.

**Width**: 320 pixels when open, with a left border that visually separates it from the main content.

**Trigger**: The OverHUD toggle button is located in the Top Command Bar's utility actions area (right side).

### What the OverHUD Contains

The OverHUD is organized into tabbed sections that provide different categories of passive intelligence:

**Security & Integrity Tab**
- BANE security alert feed — recent SDRs surfaced as status cards
- Threat level indicator — current system-wide threat assessment
- Policy enforcement summary — count of recent gate evaluations (approved/denied)
- Active session security posture

**Operational Intelligence Tab**
- Repository health status (build state, deployment version)
- Active environment indicators (development/staging/production)
- System performance metrics (response times, queue depths)
- LARI engine availability status

The OverHUD's content updates passively — you do not need to request it. When a BANE event occurs, the OverHUD reflects it. When a LARI engine changes status, the OverHUD shows it. This passive observation is the fundamental difference between the OverHUD and the Scing Panel.

### What the OverHUD Does Not Do

The OverHUD does not:

- Accept user input (no text fields, no prompt areas)
- Initiate conversations
- Execute actions
- Present itself as a command surface

If you need to act on information you see in the OverHUD — for example, if a BANE alert indicates a policy violation you need to investigate — you would open the Scing Panel and ask Scing about it. The OverHUD shows; the Scing Panel acts.

---

## 5.4 The Separation Doctrine

The Scing Panel and OverHUD serve complementary but non-overlapping functions. This separation is maintained as a governance discipline for the following reasons:

**Cognitive clarity.** An operator who is mid-conversation with Scing about an inspection report should not have their focus interrupted by a security alert appearing in the same visual surface. The OverHUD handles alerts in its own space, visible in peripheral vision but not injected into the conversation stream.

**Audit integrity.** The Scing Panel's conversation history is an auditable record of operator-initiated interaction. If system alerts were mixed into this history, it would be impossible to reconstruct what the operator asked for versus what the system injected. Separation preserves the purity of the conversational audit trail.

**Role clarity.** The Scing Panel represents human intent (requests) and coordinated response (Scing answers). The OverHUD represents system state (what is happening now). These are fundamentally different information categories, and presenting them in the same container would suggest that they are equivalent — which they are not.

---

## 5.5 Visual Design Language

Both panels share the OVERSCITE visual design language but express it differently:

### Scing Panel Visual Identity

- **Background**: Dark translucent surface with backdrop blur — consistent with the shell-surface material treatment
- **Message bubbles**: Operator messages right-aligned with subtle background; Scing messages left-aligned with a slightly different shade
- **Thinking indicator**: Animated dots or shimmer effect when LARI is processing a request
- **Gold accent**: The Scing Panel uses the platform's gold accent color (`#FFD84D`) for interactive elements, active states, and the Scing identity mark
- **Typography**: System UI font stack, with monospace for code references and technical identifiers

### OverHUD Visual Identity

- **Background**: Dark surface with left border — matches the shell surface but has a subtle left edge treatment (1px border at reduced opacity) that visually attaches it to the main content area
- **Card layout**: Information is presented in stacked cards with standardized padding, consistent with the dashboard card pattern used elsewhere in the platform
- **Status colors**: Red/amber/green for security status indicators, following standard severity conventions
- **Badge system**: Small uppercase monospace labels indicating truth-state, engine status, and classification levels

---

## 5.6 Panel State Interactions

The two panels interact with the shell layout but not with each other:

**Scing Panel open + OverHUD closed**: The Scing Panel drops down from the command bar, overlaying the main content. The main content area width does not change — the panel floats above it.

**Scing Panel closed + OverHUD open**: The OverHUD pushes the main content leftward, reducing its available width by 320 pixels. The Scing Bar remains visible in the command bar.

**Both open simultaneously**: Both panels can be open at the same time. The Scing Panel floats above the main content while the OverHUD occupies the right column. This allows an operator to have a conversation with Scing while monitoring system status in the OverHUD — the intended concurrent use pattern.

**Both closed**: Maximum main content width. The shell interface shows only the command bar, sidebar navigation, and the full-width main content area.

---

## 5.7 Practical Guidelines

**When to use the Scing Panel:**
- You want to ask a question about your current work
- You want to request a report, schedule change, or workflow action
- You want to look up a code reference, regulation, or procedure
- You want to have a multi-turn conversation about a complex topic

**When to check the OverHUD:**
- You want to see if any security events have occurred
- You want to verify the current system health
- You want to confirm the deployment environment you are working in
- You want to review recent BANE enforcement activity
- You notice the OverHUD toggle displaying a badge or alert indicator

**When they work together:**
- You see a BANE alert in the OverHUD. You open the Scing Panel and ask "Scing, what happened with that security alert?" Scing coordinates with BANE to retrieve the relevant SDR and explains the event in conversational form.
- You are reviewing inspection data in the main content area. The OverHUD shows the current weather conditions (via the operational intelligence tab). You open the Scing Panel and say "Scing, is it safe to schedule a rooftop inspection for this afternoon?" Scing considers the weather data and the IRI score.

---

## 5.8 Chapter Summary

The Scing Panel and OverHUD are OVERSCITE's two intelligence surfaces. The Scing Panel is interactive — you talk to it and it responds. The OverHUD is observational — it shows system state and security posture without requiring your attention. They can operate simultaneously but never cross boundaries: the Scing Panel never displays security alerts, and the OverHUD never accepts user input.

This separation preserves cognitive clarity, audit integrity, and role clarity — the same principles that govern the Scing–LARI–BANE model at the architecture level.

In the next chapter, we examine the navigation system — the 28 authenticated routes, the sidebar structure, and how the shell organizes the platform's operational capabilities.

---

*Previous: [Chapter 4 — The Scing–LARI–BANE Model](../vol-02-system-architecture/ch04-scing-lari-bane.md)*  
*Next: [Chapter 6 — Navigation & Routes](ch06-navigation-system.md)*
