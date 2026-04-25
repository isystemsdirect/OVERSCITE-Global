---
name: Route Runtime Check
description: Validate that primary route surfaces load and behave correctly after changes.
---

# Route Runtime Check Skill

## Purpose

Validate that the primary application routes load correctly, render without errors, and behave as expected after code changes. This skill provides a systematic approach to verifying route health across the SCINGULAR application.

## When to Use

- After modifying route definitions or page components
- After changing layout components or shared UI elements
- After modifying data fetching, authentication, or middleware logic
- After dependency upgrades that may affect rendering
- After modifying Next.js configuration
- As part of post-change stabilization

## Check Areas

### 1. Route Loading
- [ ] Verify the dev server starts without errors
- [ ] Attempt to load each primary route
- [ ] Confirm routes resolve to the correct page component
- [ ] Check for 404 or redirect loops
- [ ] Verify dynamic routes resolve correctly with sample parameters

### 2. Layout Stability
- [ ] Confirm shared layout (header, footer, sidebar) renders on all pages
- [ ] Check for layout shift or visual instability during load
- [ ] Verify responsive behavior at key breakpoints
- [ ] Check for missing CSS or style regressions

### 3. Console Error Presence
- [ ] Open browser developer tools on each route
- [ ] Check for JavaScript errors in the console
- [ ] Check for React hydration errors or warnings
- [ ] Check for failed network requests (API calls, assets)
- [ ] Note any deprecation warnings

### 4. Broken Imports
- [ ] Check the dev server terminal for import resolution errors
- [ ] Verify all component imports resolve correctly
- [ ] Check for circular dependency warnings
- [ ] Verify path aliases (`@/`, `~/`) resolve correctly

### 5. Client/Server Mismatch
- [ ] Check for hydration mismatches between server and client rendering
- [ ] Verify `'use client'` / `'use server'` directives are correctly placed
- [ ] Check for browser-only APIs used in server components
- [ ] Verify environment variables are available in the correct context (server vs. client)

## Steps

1. **Start the dev server** — `npm run dev` and wait for successful compilation
2. **Load primary routes** — Navigate to each key route in the browser
3. **Inspect each check area** — Run through the checklists above
4. **Document failures** — Record exact error messages, affected routes, and reproduction steps
5. **Produce report** — Classify each route as: Healthy | Degraded | Broken

## Deliverables

- **Route health matrix** — Table of routes with their health status
- **Error catalog** — Specific errors with file locations and reproduction steps
- **Recommendations** — Priority-ordered fixes for broken or degraded routes
