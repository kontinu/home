# Mobile Nav Toggle — Design Spec

**Date:** 2026-04-30
**Branch:** ai-generated
**Status:** Approved

## Problem

At `max-width: 54rem` the header stacks vertically with all nav links always visible. There is no collapse/expand behaviour — the nav occupies significant vertical space on mobile, creating a real UX gap.

## Decisions

| Question | Decision |
|---|---|
| Pattern | Hamburger toggle (hide/show) |
| Animation | Fade + frosted-glass blur (matches existing header `backdrop-filter`) |
| Closed state | Logo + tagline left, ☰ button right — nothing else |
| Open state | Frosted panel below bar: 3 nav links + "Hablemos" CTA |
| CTA placement | Inside the menu (not visible in closed bar) |
| Dependencies | None — vanilla JS inside the Astro component |

## Architecture

### Header.astro

Three structural changes:

1. **Hamburger button** — added inside `.site-header__bar`, right side. Uses `aria-expanded="false"` and `aria-controls="mobile-nav-panel"`. Label: `aria-label="Menú"`. Icon: `☰` (open) / `✕` (close), toggled via JS.

2. **Mobile nav panel** — `<div id="mobile-nav-panel">` wraps both `.site-header__nav` and `.site-header__actions`. Hidden by default on mobile via CSS. On desktop the wrapper is transparent (no visual change).

3. **Inline `<script>`** — three behaviours:
   - Toggle `aria-expanded` and `data-open` attribute on the header when button is clicked
   - Close menu on `Escape` keypress
   - Close menu when any nav link inside the panel is clicked (single-page anchor links)

### global.css — `max-width: 54rem` block

```
/* hide panel, show button by default */
.site-header__toggle { display: grid; }
#mobile-nav-panel {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.22s ease, max-height 0.22s ease;
  /* frosted glass */
  background: rgba(247, 250, 252, 0.97);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(19, 34, 56, 0.07);
}

/* open state — toggled via data-open on .site-header */
.site-header[data-open] #mobile-nav-panel {
  opacity: 1;
  max-height: 24rem;
}
```

On desktop (`min-width > 54rem`): `.site-header__toggle { display: none }` and panel is always visible (no opacity/max-height constraints).

### Accessibility

- `<button aria-expanded="false" aria-controls="mobile-nav-panel" aria-label="Menú">`
- `aria-expanded` flips to `"true"` when open
- Focus is not trapped (3 links only — trapping would add complexity without benefit here)

## Affected Files

| File | Change |
|---|---|
| `apps/web/src/components/Header.astro` | Add toggle button, wrap nav+CTA in panel div, add inline script |
| `apps/web/src/styles/global.css` | Add mobile panel show/hide styles to existing `max-width: 54rem` block; add desktop override |

## Out of Scope

- Focus trap inside the panel
- Slide-from-side animation (fade chosen instead)
- Icons on nav links
- Any change to desktop layout
