# OVERSCITE Global UI Layout Contract (v1.0)

## 0. Objective
Establish an immutable structural template for all OVERSCITE Global operational routes to eliminate visual and behavioral drift.

## 1. Global Shell Anatomy (The 5-Zone Model)
All operational route shells MUST implement the following five zones in the specified hierarchy:

### Zone 1: Top Command Bar
- **Position**: Global Fixed Top.
- **Content**: Global navigation, user identity status, system-wide search, and BANE/SCING presence indicators.
- **Rules**: Static across all routes. NO ad-hoc modifications permitted.

### Zone 2: Page Identity Band
- **Position**: Horizontal strip below Command Bar.
- **Content**: Page Title (e.g., "Workstation"), Mission Context (Subtitle), and Truth-State Status (e.g., "LIVE", "MOCK").
- **Rules**: Must accurately declare the route's purpose and implementation maturity.

### Zone 3: Primary Content Region
- **Position**: Center / Main Scrollable Area.
- **Content**: The core application logic (Forms, Lists, Maps, Grids).
- **Rules**: Must dominate the visual hierarchy. Padding MUST be standardized (e.g., `p-6`).

### Zone 4: Contextual Intelligence Panel
- **Position**: Right Sidebar or Collapsible Drawer.
- **Content**: Secondary data, AI suggestions, related audit logs, or property metadata.
- **Rules**: Must support the Primary Region without causing cognitive overload.

### Zone 5: Action Surface (Quick Actions Zone)
- **Position**: Bottom Bar or specific Page Header cluster.
- **Content**: Commits, Saves, Dispatches, and state transitions.
- **Rules**: High-priority actions MUST appear in predictable locations.

## 2. Page Anatomy Template
```typescript
<UnifiedShell>
  <PageHeader title="..." subtitle="..." status="..." />
  <main className="flex-1 p-6">
    <ContentRegion />
  </main>
  <aside className="w-80 border-l border-border/40">
    <IntelligencePanel />
  </aside>
</UnifiedShell>
```

## 3. Visual Discipline Rules
- **Spacing**: Use standard Tailwind scale (`gap-6`, `p-6`, `space-y-6`).
- **Typography Hierarchy**: H1 (4xl), H2 (2xl), H3 (lg/xl), Label (xs, uppercase, tracking-widest).
- **Console Style**: Dark mode by default, high-contrast borders (`border-border/40`), glassmorphism backgrounds (`bg-card/40 backdrop-blur-md`).
- **Identity Alignment**: Use `CANON.PLATFORM_NAME` and `CANON.BFI` from terminology services.
