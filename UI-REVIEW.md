# UI Review — Branch: ai-generated (Full Astro + Sanity Rebuild)

**Audit date:** 2026-04-29
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md present)
**Overall Score:** 15/24
**Screenshots:** Not captured — dev server not running

---

## Pillar Summary

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 2/4 | Three sections on index.astro contain internal/process copy instead of visitor-facing content |
| 2. Visuals | 3/4 | Orbital diagram is purely decorative CSS; no real imagery, logos, or icons anywhere |
| 3. Color | 3/4 | Well-structured token system; amber tokens defined but unused; 18 raw rgba values bypass tokens |
| 4. Typography | 2/4 | 9 raw non-token font sizes; fonts never loaded — visitors always see system font fallback |
| 5. Spacing | 2/4 | 54 raw rem values and 35 hard-coded numeric spacings bypass the 10-step token scale |
| 6. Experience Design | 3/4 | No mobile hamburger menu; no prefers-reduced-motion; no OG meta; active nav state missing |

---

## Top Priority Fixes

### 1. BLOCKER — Internal process copy shipped as visitor-facing content (`index.astro`)

Three copy strings on the public homepage describe the redesign to its builders, not Kontinu's value to visitors:

- `index.astro:16` — SectionHeading body: *"La homepage organiza la oferta para que líderes, plataformas internas y equipos técnicos encuentren rápido si necesitan consultoría aplicada o formación de alto impacto."* — this describes the page's own navigation design.
- `index.astro:86` — SectionHeading body: *"El rediseño se mantiene enfocado en una señal corporativa clara: experiencia seria, lenguaje concreto y una propuesta unificada entre advisory y enablement."* — "el rediseño" is internal planning language.
- `index.astro:122` — CtaBand body: *"La nueva homepage deja ambos caminos visibles desde el primer scroll para que cada visitante entre por la conversación correcta."* — describes the UX decision, not a CTA driver.

**Fix:** Rewrite all three to visitor-facing copy. Example for line 122: *"Cuéntanos el desafío: si necesitas ordenar una plataforma o elevar al equipo, encontramos juntos el punto de entrada."*

### 2. BLOCKER — Font loading missing from `BaseLayout.astro`

Manrope and Space Grotesk are declared in `--font-body` and `--font-heading` tokens but are never loaded. No `@font-face`, no `<link rel="stylesheet">` for Google Fonts. Every visitor receives the system font fallback (Avenir Next / Segoe UI Variable). The typographic identity is never rendered.

**Fix:** Add `<link rel="preconnect" href="https://fonts.googleapis.com">` + `<link rel="stylesheet">` for both fonts in `BaseLayout.astro`, or self-host via `@font-face` in `global.css`.

### 3. WARNING — No mobile navigation toggle (`Header.astro`)

At `max-width: 54rem`, the header stacks vertically but all nav items remain in visible block flow with no hide/show mechanism. On a 375px viewport, the full nav consumes ~120px of above-fold space before any content. No hamburger, no disclosure pattern.

**Fix:** Add a `<button aria-controls="primary-nav" aria-expanded>` toggle with a matching `<nav id="primary-nav">` and a `@media (max-width: 54rem)` rule that hides the nav by default and reveals it on toggle.

---

## Detailed Findings

### Pillar 1: Copywriting — 2/4

Strong foundations in content files (`homepage.ts`, `offering-content.ts`, `site-shell.ts`). CTAs are specific and in-context ("Solicitar propuesta", "Inscribirme"). Empty and 404 states are fully written in warm, branded Spanish. The hero lede is substantive.

**BLOCKER:** Three homepage body strings use internal process language (see Top Fix #1 above).

**Minor:** `index.astro:124-125` CTA labels "Ir a Servicios" / "Ir a Bootcamps" are weaker than primary CTAs elsewhere ("Explorar servicios", "Ver bootcamps") — inconsistent verb register within the same page.

---

### Pillar 2: Visuals — 3/4

CSS-only visual system is a valid design choice for a technical consulting brand. The orbital diagram (`hero__orbital`) provides the only decorative visual.

**WARNING:**
- No images, illustrations, or client logos exist in `apps/web/public/` or `apps/web/src/assets/`. For enterprise B2B consulting, this is a credibility gap.
- No `<link rel="icon">` in `BaseLayout.astro` — browser tabs show a blank icon.
- No `<meta property="og:image">` — social/messaging previews render broken.

**Minor:** The orbital diagram has `aria-label` on the `<aside>` but communicates nothing about what each orbit ring represents to users without the JS context of the three panel cards below it.

---

### Pillar 3: Color — 3/4

Token system is well-structured: 8-step ink scale, 4-step accent scale (green family), surface/border semantic tokens, two shadow tokens. 60/30/10 distribution intent is visible and generally followed.

**WARNING:**
- `tokens.css:18-19` defines `--color-amber-500` and `--color-amber-100` — neither appears anywhere in `global.css`. Dead tokens that share hue with the accent family and add naming confusion (`--color-amber-500: #61db8c` is the same value as `--color-accent-600`).
- `global.css:18`: body background gradient uses raw `#f6fbff`, `#eef4f8` hex values instead of ink-scale tokens.
- `global.css:174`: hero panel gradient uses `#243247`, `#1d293b`, `#161f2d` — closely matching `--color-ink-900/800/950` but not using them.
- `global.css:291`: `color: #14261e` for hero button text — one-off hex not in any token.
- ~18 direct `rgba()` declarations bypass the token layer where ink tokens with alpha would serve.

No WCAG contrast failures found for current color usage.

---

### Pillar 4: Typography — 2/4

Token scale defines 7 steps (`xs` through `3xl`) using fluid `clamp()` values. Font pairing (Manrope body + Space Grotesk heading) is appropriate.

**BLOCKER:** Fonts are never loaded (see Top Fix #2 above).

**WARNING — 9 raw non-token font sizes in `global.css`:**
- `global.css:206`: `.hero__title { font-size: clamp(3rem, 7vw, 5.8rem) }` — custom clamp not in scale
- `global.css:424`: `.hero__panel-kicker { font-size: 0.72rem }` — no token
- `global.css:433`: `.hero__panel-title { font-size: 1rem }` — should be `var(--text-base)`
- `global.css:442`: `.hero__panel-body { font-size: 0.78rem }` — no token
- `global.css:723`: `.site-header__logo { font-size: 1.15rem }` — no token
- `global.css:774`: `.site-footer__title { font-size: 1.15rem }` — no token
- Plus a second custom clamp for responsive hero title override

**Minor:** `.signal-card__kicker` uses `font-weight: 800` (`global.css:672`) while all other weighted elements use 700 — introduces a third unlisted weight not declared as a token.

---

### Pillar 5: Spacing — 2/4

The 10-step named scale (`--space-2xs` through `--space-3xl`) is defined in `tokens.css` and is used correctly in structural elements (`.section`, `.section-heading`, card grids). However **54 raw rem values and ~35 hard-coded numeric spacings bypass the scale entirely**.

**WARNING — specific violations:**
- Button padding: `0.8rem 1.2rem` (`global.css:237`)
- Eyebrow pill padding: `0.4rem 0.8rem` (`global.css:98`)
- Action groups gap: `0.9rem` (`global.css:227`), `0.8rem` (`global.css:275`)
- Hero orbital node padding: `0.95rem`, `0.85rem` throughout
- Signal card kicker margin: `0 0 0.65rem` (`global.css:669`)
- Hero panel card padding: `0.95rem` (`global.css:416`)
- Detail list gap: `0.7rem` (`global.css:494`)

Values like `0.65rem`, `0.7rem`, `0.8rem`, `0.9rem` all exist between defined scale steps, creating an informal parallel spacing system. Systematic adjustment (e.g., for density changes) requires touching all 54+ individual values.

---

### Pillar 6: Experience Design — 3/4

Strong foundations: skip link implemented and keyboard-accessible, `lang="es"` on `<html>`, all empty/404 states handled with recovery CTAs, Sanity fetch failures degrade to fallback content (`offering-content.ts:206-215`), `focus-visible` outline styled globally, header is `position: sticky`.

**WARNING — Mobile navigation** (see Top Fix #3 above).

**WARNING — No active/current nav state.** `Header.astro` renders nav links without `aria-current="page"` or active class. `Astro.url` could be compared against each nav `href`.

**WARNING — No OG / Twitter card meta tags** in `BaseLayout.astro`. `<title>` and `<meta name="description">` are present but social sharing yields blank link previews.

**WARNING — No favicon.** `<link rel="icon">` absent from `BaseLayout.astro`.

**Minor — `prefers-reduced-motion` not handled.** Button hover (180ms) and skip-link reveal (160ms) transitions are not suppressed. No animated hero elements present currently, but should be addressed before any motion is added.

**Minor — Sticky header anchor offset.** `/#como-trabajamos` linked from nav fires scroll but the 68px sticky header overlaps the section heading target.

**Minor — Back link lacks directional affordance.** "Volver a servicios" is plain text with accent color — no `←` prefix for visual scanning.

---

## Files Audited

- [apps/web/src/components/Hero.astro](apps/web/src/components/Hero.astro)
- [apps/web/src/components/Header.astro](apps/web/src/components/Header.astro)
- [apps/web/src/components/Footer.astro](apps/web/src/components/Footer.astro)
- [apps/web/src/components/CtaBand.astro](apps/web/src/components/CtaBand.astro)
- [apps/web/src/components/ServiceCard.astro](apps/web/src/components/ServiceCard.astro)
- [apps/web/src/components/BootcampCard.astro](apps/web/src/components/BootcampCard.astro)
- [apps/web/src/components/SectionHeading.astro](apps/web/src/components/SectionHeading.astro)
- [apps/web/src/components/RichTextBlocks.astro](apps/web/src/components/RichTextBlocks.astro)
- [apps/web/src/layouts/BaseLayout.astro](apps/web/src/layouts/BaseLayout.astro)
- [apps/web/src/pages/index.astro](apps/web/src/pages/index.astro)
- [apps/web/src/pages/bootcamps/index.astro](apps/web/src/pages/bootcamps/index.astro)
- [apps/web/src/pages/bootcamps/[slug].astro](apps/web/src/pages/bootcamps/[slug].astro)
- [apps/web/src/pages/servicios/index.astro](apps/web/src/pages/servicios/index.astro)
- [apps/web/src/pages/servicios/[slug].astro](apps/web/src/pages/servicios/[slug].astro)
- [apps/web/src/styles/global.css](apps/web/src/styles/global.css)
- [apps/web/src/styles/tokens.css](apps/web/src/styles/tokens.css)
- [apps/web/src/content/homepage.ts](apps/web/src/content/homepage.ts)
- [apps/web/src/content/site-shell.ts](apps/web/src/content/site-shell.ts)
- [apps/web/src/lib/offering-content.ts](apps/web/src/lib/offering-content.ts)

---

## Finding Count

| Severity | Count |
|----------|-------|
| BLOCKER | 2 |
| WARNING | 6 |
| Minor | 5 |
