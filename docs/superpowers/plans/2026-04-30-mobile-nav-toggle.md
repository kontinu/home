# Mobile Nav Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hamburger toggle to the site header that reveals a frosted-glass panel with nav links and CTA on mobile (≤54rem), with no change to the desktop layout.

**Architecture:** On desktop the panel wrapper uses `display: contents` so its children (nav + actions) participate in the existing flex row unchanged. On mobile the panel switches to `position: absolute` with an opacity + max-height fade transition, hidden by default and revealed by a `data-open` attribute toggled by inline JS. No new dependencies.

**Tech Stack:** Astro, vanilla CSS (CSS custom properties from `tokens.css`), vanilla JS/TypeScript inside Astro `<script>` block, Playwright for E2E tests.

---

### Task 1: Write the failing E2E test

**Files:**
- Create: `apps/web/e2e/mobile-nav.spec.ts`

- [ ] **Step 1: Create the test file**

```typescript
// apps/web/e2e/mobile-nav.spec.ts
import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("mobile nav toggle shows and hides the nav panel", async ({ page }) => {
  await page.goto("/");

  // Nav links hidden on load
  await expect(page.getByRole("link", { name: "Servicios" }).first()).not.toBeVisible();
  await expect(page.getByRole("link", { name: "Bootcamps" }).first()).not.toBeVisible();

  // Open menu
  await page.getByRole("button", { name: "Menú" }).click();
  await expect(page.getByRole("link", { name: "Servicios" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Bootcamps" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Cómo trabajamos" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Hablemos" }).first()).toBeVisible();

  // aria-expanded reflects state
  await expect(page.getByRole("button", { name: "Menú" })).toHaveAttribute("aria-expanded", "true");

  // Close with Escape
  await page.keyboard.press("Escape");
  await expect(page.getByRole("link", { name: "Servicios" }).first()).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Menú" })).toHaveAttribute("aria-expanded", "false");

  // Re-open and close by clicking a link
  await page.getByRole("button", { name: "Menú" }).click();
  await page.getByRole("link", { name: "Servicios" }).first().click();
  // After navigation, menu is closed (aria-expanded false)
  await expect(page.getByRole("button", { name: "Menú" })).toHaveAttribute("aria-expanded", "false");
});
```

- [ ] **Step 2: Run the test to verify it fails**

With the dev server running (`pnpm --filter web dev` in a separate terminal):

```bash
cd /Users/marcoscano/kontinu/github/www.kontinu.io && pnpm --filter web test:e2e --grep "mobile nav"
```

Expected: FAIL — "button" with name "Menú" not found.

- [ ] **Step 3: Commit the failing test**

```bash
git add apps/web/e2e/mobile-nav.spec.ts
git commit -m "test: add failing E2E for mobile nav toggle"
```

---

### Task 2: Update Header.astro — toggle button + panel structure + JS

**Files:**
- Modify: `apps/web/src/components/Header.astro`

- [ ] **Step 1: Replace the entire file with the new structure**

```astro
---
import { siteShell } from "../content/site-shell";
---

<header class="site-header">
  <div class="container-wide site-header__bar">
    <div class="site-header__brand">
      <a class="site-header__logo" href="/">
        <span class="site-header__logo-mark" aria-hidden="true">K</span>
        <span>{siteShell.siteName}</span>
      </a>
      <p class="site-header__meta">{siteShell.tagLine}</p>
    </div>

    <button
      class="site-header__toggle"
      aria-expanded="false"
      aria-controls="mobile-nav-panel"
      aria-label="Menú"
    >
      <span class="site-header__toggle-open" aria-hidden="true">&#9776;</span>
      <span class="site-header__toggle-close" aria-hidden="true">&#10005;</span>
    </button>

    <div id="mobile-nav-panel" class="site-header__panel">
      <nav aria-label="Principal" class="site-header__nav">
        {siteShell.nav.map((item) => (
          <a href={item.href}>{item.label}</a>
        ))}
      </nav>

      <div class="site-header__actions">
        <a class="button-secondary" href="mailto:hola@kontinu.io">Hablemos</a>
      </div>
    </div>
  </div>
</header>

<script>
  const header = document.querySelector(".site-header") as HTMLElement;
  const toggle = header.querySelector<HTMLButtonElement>(".site-header__toggle")!;
  const panel = document.getElementById("mobile-nav-panel")!;

  function openMenu(): void {
    header.setAttribute("data-open", "");
    toggle.setAttribute("aria-expanded", "true");
  }

  function closeMenu(): void {
    header.removeAttribute("data-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    header.hasAttribute("data-open") ? closeMenu() : openMenu();
  });

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") closeMenu();
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
</script>
```

- [ ] **Step 2: Verify Astro compiles without errors**

```bash
cd /Users/marcoscano/kontinu/github/www.kontinu.io && pnpm --filter web check
```

Expected: No TypeScript or Astro errors.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/Header.astro
git commit -m "feat: add mobile nav toggle button and panel to Header.astro"
```

---

### Task 3: Add CSS — desktop defaults + mobile panel styles

**Files:**
- Modify: `apps/web/src/styles/global.css`

- [ ] **Step 1: Add desktop defaults after the `.site-header__nav a:hover` rule (~line 754)**

Insert immediately after the `.site-header__nav a:hover { ... }` block:

```css
.site-header__toggle {
  display: none;
}

.site-header__panel {
  display: contents;
}

.site-header__toggle-close {
  display: none;
}
```

- [ ] **Step 2: Replace the three header rules in the `max-width: 54rem` block**

Find this block inside `@media (max-width: 54rem)`:

```css
  .site-header__bar {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-header__actions {
    width: 100%;
  }

  .site-header__actions .button-secondary {
    width: 100%;
  }
```

Replace those three rule blocks with:

```css
  .site-header {
    position: relative;
  }

  .site-header__bar {
    flex-direction: row;
    align-items: center;
  }

  .site-header__toggle {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 0.6rem;
    border: 1.5px solid var(--color-border-strong);
    background: var(--color-surface-strong);
    cursor: pointer;
    color: var(--color-ink-950);
    font-size: 1.05rem;
  }

  .site-header[data-open] .site-header__toggle-open {
    display: none;
  }

  .site-header[data-open] .site-header__toggle-close {
    display: inline;
  }

  .site-header__panel {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(247, 250, 252, 0.97);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(19, 34, 56, 0.07);
    overflow: hidden;
    opacity: 0;
    max-height: 0;
    transition: opacity 0.22s ease, max-height 0.22s ease;
    pointer-events: none;
  }

  .site-header[data-open] .site-header__panel {
    opacity: 1;
    max-height: 24rem;
    pointer-events: auto;
  }

  .site-header__panel .site-header__nav {
    flex-direction: column;
    padding-top: var(--space-sm);
    gap: var(--space-2xs);
  }

  .site-header__panel .site-header__nav a {
    display: block;
    background: rgba(255, 255, 255, 0.85);
    border: 1px solid rgba(19, 34, 56, 0.06);
  }

  .site-header__panel .site-header__actions {
    width: 100%;
    padding: var(--space-2xs) 0 var(--space-sm);
  }

  .site-header__panel .site-header__actions .button-secondary {
    width: 100%;
    text-align: center;
    display: block;
  }
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/styles/global.css
git commit -m "feat: add mobile nav panel CSS with frosted glass fade transition"
```

---

### Task 4: Run the E2E test and verify it passes

- [ ] **Step 1: Ensure dev server is running**

```bash
pnpm --filter web dev
```

Expected: Server listening on http://127.0.0.1:4321

- [ ] **Step 2: Run the mobile nav test**

```bash
cd /Users/marcoscano/kontinu/github/www.kontinu.io && pnpm --filter web test:e2e --grep "mobile nav"
```

Expected: PASS — all assertions green.

- [ ] **Step 3: Run the full E2E suite to catch regressions**

```bash
cd /Users/marcoscano/kontinu/github/www.kontinu.io && pnpm --filter web test:e2e
```

Expected: All tests pass. If the homepage spec fails because nav links are now hidden on mobile viewport, update the assertion to use `.first()` with a desktop viewport or add `test.use({ viewport: ... })` to that spec.

- [ ] **Step 4: Commit if any test fixes were needed**

```bash
git add apps/web/e2e/
git commit -m "fix: update homepage E2E for mobile nav visibility change"
```
