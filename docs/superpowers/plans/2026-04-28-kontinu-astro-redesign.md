# Kontinu Astro Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `www.kontinu.io` as a modern `Astro + Sanity` marketing site with a full content rewrite, Docker-based local development, and `Vercel` deployment while keeping the legacy Jekyll site untouched during the migration.

**Architecture:** Build the new site in parallel under a workspace-based structure so the current root Jekyll files can remain in place until cutover. The repo becomes a small monorepo with `apps/web` for the Astro frontend and `apps/studio` for Sanity Studio, plus shared root tooling for `pnpm`, `docker compose`, and validation scripts. The frontend owns layouts, components, design tokens, routing, and CTA behavior; Sanity owns structured marketing content such as services, bootcamps, FAQs, posts, and reusable page content.

**Tech Stack:** `Astro`, `TypeScript`, `Sanity`, `pnpm` workspaces, `Docker`, `docker compose`, `Vercel`, `Vitest`, `Playwright`

---

## File Structure

### New root files

- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.nvmrc`
- Create: `.dockerignore`
- Create: `.env.example`
- Modify: `.gitignore`
- Modify: `README.md`
- Modify: `docker-compose.yml`
- Create: `apps/web/Dockerfile`
- Create: `apps/studio/Dockerfile`

### New frontend files

- Create: `apps/web/package.json`
- Create: `apps/web/astro.config.mjs`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/playwright.config.ts`
- Create: `apps/web/src/env.d.ts`
- Create: `apps/web/src/styles/tokens.css`
- Create: `apps/web/src/styles/global.css`
- Create: `apps/web/src/lib/env.ts`
- Create: `apps/web/src/lib/sanity.client.ts`
- Create: `apps/web/src/lib/sanity.queries.ts`
- Create: `apps/web/src/lib/seo.ts`
- Create: `apps/web/src/content/site-shell.ts`
- Create: `apps/web/src/layouts/BaseLayout.astro`
- Create: `apps/web/src/components/*`
- Create: `apps/web/src/pages/index.astro`
- Create: `apps/web/src/pages/servicios/index.astro`
- Create: `apps/web/src/pages/servicios/[slug].astro`
- Create: `apps/web/src/pages/bootcamps/index.astro`
- Create: `apps/web/src/pages/bootcamps/[slug].astro`
- Create: `apps/web/src/pages/nosotros.astro`
- Create: `apps/web/src/pages/blog/index.astro`
- Create: `apps/web/src/pages/blog/[slug].astro`
- Create: `apps/web/src/pages/contacto.astro`
- Create: `apps/web/src/pages/api/contact.ts`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/playwright.config.ts`
- Create: `apps/web/tests/*.test.ts`
- Create: `apps/web/e2e/*.spec.ts`

### New Sanity files

- Create: `apps/studio/package.json`
- Create: `apps/studio/sanity.config.ts`
- Create: `apps/studio/sanity.cli.ts`
- Create: `apps/studio/schemaTypes/index.ts`
- Create: `apps/studio/schemaTypes/documents/service.ts`
- Create: `apps/studio/schemaTypes/documents/bootcamp.ts`
- Create: `apps/studio/schemaTypes/documents/post.ts`
- Create: `apps/studio/schemaTypes/documents/faq.ts`
- Create: `apps/studio/schemaTypes/documents/siteSettings.ts`
- Create: `apps/studio/schemaTypes/objects/cta.ts`
- Create: `apps/studio/schemaTypes/objects/richText.ts`

### New deployment and migration files

- Create: `vercel.json`
- Create: `apps/web/public/robots.txt`
- Create: `apps/web/public/site.webmanifest`
- Create: `docs/migration/kontinu-url-map.md`

## Task 1: Scaffold the parallel workspace and local developer experience

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.nvmrc`
- Create: `.dockerignore`
- Create: `.env.example`
- Modify: `.gitignore`
- Modify: `docker-compose.yml`
- Create: `apps/web/Dockerfile`
- Create: `apps/studio/Dockerfile`
- Create: `apps/web/package.json`
- Create: `apps/web/astro.config.mjs`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/playwright.config.ts`
- Create: `apps/studio/package.json`
- Create: `apps/studio/sanity.config.ts`

- [ ] **Step 1: Write the failing workspace checks**

```bash
pnpm --filter @kontinu/web build
pnpm --filter @kontinu/studio sanity --help
docker compose config
```

Expected:
- `pnpm` commands fail because the workspaces do not exist yet
- `docker compose config` only reflects the legacy Jekyll service and does not define the new workflow

- [ ] **Step 2: Implement the root workspace scaffold**

```json
{
  "name": "kontinu-site",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "dev:web": "pnpm --filter @kontinu/web dev",
    "dev:studio": "pnpm --filter @kontinu/studio dev",
    "build:web": "pnpm --filter @kontinu/web build",
    "build:studio": "pnpm --filter @kontinu/studio build",
    "check:web": "pnpm --filter @kontinu/web check",
    "test:web": "pnpm --filter @kontinu/web test",
    "test:e2e": "pnpm --filter @kontinu/web test:e2e",
    "validate": "pnpm build:web && pnpm check:web && pnpm test:web"
  }
}
```

```yaml
packages:
  - apps/*
```

```dockerignore
node_modules
.pnpm-store
apps/web/dist
apps/studio/dist
.git
_site
```

- [ ] **Step 3: Implement the frontend and studio package skeletons**

```json
{
  "name": "@kontinu/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev --host 0.0.0.0 --port 4321",
    "build": "astro build",
    "preview": "astro preview --host 0.0.0.0 --port 4321",
    "check": "astro check",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"]
  }
});
```

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:4321"
  }
});
```

```json
{
  "name": "@kontinu/studio",
  "private": true,
  "scripts": {
    "dev": "sanity dev --host 0.0.0.0 --port 3333",
    "build": "sanity build"
  }
}
```

```yaml
services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    command: pnpm --filter @kontinu/web dev
    ports:
      - "4321:4321"
    volumes:
      - .:/workspace
      - web-node-modules:/workspace/node_modules
  studio:
    build:
      context: .
      dockerfile: apps/studio/Dockerfile
    command: pnpm --filter @kontinu/studio dev
    ports:
      - "3333:3333"
    volumes:
      - .:/workspace
      - studio-node-modules:/workspace/node_modules
volumes:
  web-node-modules:
  studio-node-modules:
```

```dockerfile
FROM node:20-bookworm-slim
WORKDIR /workspace
RUN corepack enable
CMD ["pnpm", "--filter", "@kontinu/web", "dev"]
```

```dockerfile
FROM node:20-bookworm-slim
WORKDIR /workspace
RUN corepack enable
CMD ["pnpm", "--filter", "@kontinu/studio", "dev"]
```

- [ ] **Step 4: Run the new tooling checks**

Run:

```bash
pnpm install
pnpm --filter @kontinu/web build
pnpm --filter @kontinu/studio build
docker compose config
```

Expected:
- install completes without workspace resolution errors
- Astro and Sanity packages resolve
- compose config includes `web` and `studio`

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml .nvmrc .dockerignore .env.example .gitignore docker-compose.yml apps/web apps/studio
git commit -m "chore: scaffold Astro and Sanity workspace"
```

## Task 2: Add environment validation, Sanity integration, and reusable content models

**Files:**
- Create: `apps/web/src/lib/env.ts`
- Create: `apps/web/src/lib/sanity.client.ts`
- Create: `apps/web/src/lib/sanity.queries.ts`
- Create: `apps/web/tests/env.test.ts`
- Create: `apps/web/tests/sanity-queries.test.ts`
- Create: `apps/studio/sanity.cli.ts`
- Create: `apps/studio/schemaTypes/index.ts`
- Create: `apps/studio/schemaTypes/documents/service.ts`
- Create: `apps/studio/schemaTypes/documents/bootcamp.ts`
- Create: `apps/studio/schemaTypes/documents/post.ts`
- Create: `apps/studio/schemaTypes/documents/faq.ts`
- Create: `apps/studio/schemaTypes/documents/siteSettings.ts`
- Create: `apps/studio/schemaTypes/objects/cta.ts`
- Create: `apps/studio/schemaTypes/objects/richText.ts`

- [ ] **Step 1: Write failing tests for env parsing and query shape**

```ts
import { describe, expect, it } from "vitest";
import { getPublicEnv } from "../src/lib/env";

describe("getPublicEnv", () => {
  it("throws when required Sanity variables are missing", () => {
    expect(() => getPublicEnv({} as ImportMetaEnv)).toThrow("PUBLIC_SANITY_PROJECT_ID");
  });
});
```

```ts
import { describe, expect, it } from "vitest";
import { serviceCardProjection } from "../src/lib/sanity.queries";

describe("serviceCardProjection", () => {
  it("includes slug, title, summary, and primary CTA fields", () => {
    expect(serviceCardProjection).toContain("slug");
    expect(serviceCardProjection).toContain("title");
    expect(serviceCardProjection).toContain("summary");
    expect(serviceCardProjection).toContain("primaryCta");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
pnpm --filter @kontinu/web test
```

Expected: FAIL because `env.ts`, `sanity.queries.ts`, and test wiring do not exist yet

- [ ] **Step 3: Implement env parsing, Sanity client creation, and initial schema objects**

```ts
export function getPublicEnv(env: ImportMetaEnv) {
  const required = [
    "PUBLIC_SANITY_PROJECT_ID",
    "PUBLIC_SANITY_DATASET",
    "PUBLIC_SITE_URL"
  ] as const;

  for (const key of required) {
    if (!env[key]) throw new Error(`Missing required env var: ${key}`);
  }

  return {
    projectId: env.PUBLIC_SANITY_PROJECT_ID,
    dataset: env.PUBLIC_SANITY_DATASET,
    siteUrl: env.PUBLIC_SITE_URL
  };
}
```

```ts
export const serviceCardProjection = `
  _id,
  title,
  "slug": slug.current,
  summary,
  primaryCta
`;
```

```ts
export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "summary", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "body", type: "richText" }),
    defineField({ name: "primaryCta", type: "cta" })
  ]
});
```

- [ ] **Step 4: Run unit tests and studio build**

Run:

```bash
pnpm --filter @kontinu/web test
pnpm --filter @kontinu/studio build
```

Expected:
- Vitest passes
- Sanity schema compiles without type or schema registration errors

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib apps/web/tests apps/studio
git commit -m "feat: add Sanity content model foundation"
```

## Task 3: Build the shared design system, shell, and homepage

**Files:**
- Create: `apps/web/src/styles/tokens.css`
- Create: `apps/web/src/styles/global.css`
- Create: `apps/web/src/content/site-shell.ts`
- Create: `apps/web/src/layouts/BaseLayout.astro`
- Create: `apps/web/src/components/Header.astro`
- Create: `apps/web/src/components/Footer.astro`
- Create: `apps/web/src/components/Hero.astro`
- Create: `apps/web/src/components/SectionHeading.astro`
- Create: `apps/web/src/components/CtaBand.astro`
- Create: `apps/web/src/pages/index.astro`
- Create: `apps/web/e2e/homepage.spec.ts`

- [ ] **Step 1: Write the failing homepage smoke test**

```ts
import { test, expect } from "@playwright/test";

test("homepage routes visitors to services and bootcamps", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /cloud|kubernetes|containers/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /servicios/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /bootcamps/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run:

```bash
pnpm --filter @kontinu/web test:e2e -- homepage.spec.ts
```

Expected: FAIL because no homepage or app shell exists yet

- [ ] **Step 3: Implement the shell, tokens, and homepage**

```css
:root {
  --bg: #f8fafc;
  --surface: #ffffff;
  --ink: #0f172a;
  --muted: #475569;
  --line: #cbd5e1;
  --brand: #0f766e;
  --brand-strong: #115e59;
  --accent: #1d4ed8;
  --max-width: 76rem;
  --radius-lg: 1.5rem;
}
```

```ts
export const siteShell = {
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/servicios", label: "Servicios" },
    { href: "/bootcamps", label: "Bootcamps" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/blog", label: "Blog" },
    { href: "/contacto", label: "Contacto" }
  ],
  hero: {
    eyebrow: "Consultoria DevOps y formacion tecnica",
    title: "Aceleramos equipos con cloud, Kubernetes, containers y practicas modernas de entrega.",
    primaryCta: { href: "/servicios", label: "Explorar servicios" },
    secondaryCta: { href: "/bootcamps", label: "Ver bootcamps" }
  }
};
```

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
import CtaBand from "../components/CtaBand.astro";
import { siteShell } from "../content/site-shell";
---
<BaseLayout title="Kontinu | Consultoria DevOps y Bootcamps">
  <Hero {...siteShell.hero} />
  <section>
    <h2>Dos caminos claros para avanzar</h2>
    <a href="/servicios">Servicios</a>
    <a href="/bootcamps">Bootcamps</a>
  </section>
  <CtaBand />
</BaseLayout>
```

- [ ] **Step 4: Run checks and the homepage smoke test**

Run:

```bash
pnpm --filter @kontinu/web check
pnpm --filter @kontinu/web test:e2e -- homepage.spec.ts
```

Expected:
- Astro types and routes compile
- homepage smoke test passes

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/styles apps/web/src/content apps/web/src/layouts apps/web/src/components apps/web/src/pages/index.astro apps/web/e2e/homepage.spec.ts
git commit -m "feat: build new site shell and homepage"
```

## Task 4: Implement Services and Bootcamps collection/detail flows

**Files:**
- Create: `apps/web/src/components/ServiceCard.astro`
- Create: `apps/web/src/components/BootcampCard.astro`
- Create: `apps/web/src/pages/servicios/index.astro`
- Create: `apps/web/src/pages/servicios/[slug].astro`
- Create: `apps/web/src/pages/bootcamps/index.astro`
- Create: `apps/web/src/pages/bootcamps/[slug].astro`
- Create: `apps/web/e2e/services.spec.ts`
- Create: `apps/web/e2e/bootcamps.spec.ts`
- Modify: `apps/web/src/lib/sanity.queries.ts`

- [ ] **Step 1: Write failing E2E tests for listing and detail routes**

```ts
test("services listing renders cards and proposal CTA", async ({ page }) => {
  await page.goto("/servicios");
  await expect(page.getByRole("heading", { name: /servicios/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /solicitar propuesta/i })).toBeVisible();
});
```

```ts
test("bootcamp listing renders enrollment CTA", async ({ page }) => {
  await page.goto("/bootcamps");
  await expect(page.getByRole("heading", { name: /bootcamps/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /inscribirme|solicitar informacion|lista de interes/i })).toBeVisible();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run:

```bash
pnpm --filter @kontinu/web test:e2e -- services.spec.ts bootcamps.spec.ts
```

Expected: FAIL because the routes and cards do not exist yet

- [ ] **Step 3: Implement listing and detail pages with CMS-backed data and sensible static fallback**

```ts
export const servicesQuery = `
  *[_type == "service"] | order(title asc) {
    ${serviceCardProjection}
  }
`;

export const serviceBySlugQuery = `
  *[_type == "service" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    summary,
    body,
    primaryCta
  }
`;
```

```astro
---
const services = await getServices();
---
<BaseLayout title="Servicios | Kontinu">
  <section>
    <h1>Servicios</h1>
    {services.map((service) => <ServiceCard service={service} />)}
  </section>
</BaseLayout>
```

```astro
---
export async function getStaticPaths() {
  const services = await getServices();
  return services.map((service) => ({ params: { slug: service.slug } }));
}
---
<BaseLayout title={`${service.title} | Kontinu`}>
  <article>
    <h1>{service.title}</h1>
    <p>{service.summary}</p>
    <a href="/contacto?intent=proposal">Solicitar propuesta</a>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Run route checks and E2E tests**

Run:

```bash
pnpm --filter @kontinu/web check
pnpm --filter @kontinu/web test:e2e -- services.spec.ts bootcamps.spec.ts
```

Expected:
- listing and detail routes compile
- CTA behavior matches the intended funnel split

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components apps/web/src/pages/servicios apps/web/src/pages/bootcamps apps/web/src/lib/sanity.queries.ts apps/web/e2e/services.spec.ts apps/web/e2e/bootcamps.spec.ts
git commit -m "feat: add services and bootcamps content flows"
```

## Task 5: Implement About, Contact, Blog foundation, SEO, and contact workflow

**Files:**
- Create: `apps/web/src/lib/seo.ts`
- Create: `apps/web/src/pages/nosotros.astro`
- Create: `apps/web/src/pages/contacto.astro`
- Create: `apps/web/src/pages/blog/index.astro`
- Create: `apps/web/src/pages/blog/[slug].astro`
- Create: `apps/web/src/pages/api/contact.ts`
- Create: `apps/web/e2e/contact.spec.ts`
- Create: `apps/web/e2e/blog.spec.ts`
- Create: `apps/web/tests/contact-api.test.ts`
- Create: `apps/web/public/robots.txt`
- Create: `apps/web/public/site.webmanifest`

- [ ] **Step 1: Write failing tests for blog rendering and contact API validation**

```ts
test("contact page exposes the mixed CTA flow", async ({ page }) => {
  await page.goto("/contacto");
  await expect(page.getByRole("button", { name: /enviar/i })).toBeVisible();
});
```

```ts
import { describe, expect, it } from "vitest";
import { validateContactPayload } from "../src/pages/api/contact";

describe("validateContactPayload", () => {
  it("rejects invalid submissions", () => {
    expect(() => validateContactPayload({ email: "bad" })).toThrow();
  });
});
```

```ts
test("blog index renders the insights foundation", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { name: /blog|insights/i })).toBeVisible();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
pnpm --filter @kontinu/web test
pnpm --filter @kontinu/web test:e2e -- contact.spec.ts blog.spec.ts
```

Expected: FAIL because the API validation and routes do not exist yet

- [ ] **Step 3: Implement page foundations, metadata helpers, and Vercel-safe contact handling**

```ts
export function buildSeo({
  title,
  description,
  path
}: {
  title: string;
  description: string;
  path: string;
}) {
  return {
    title,
    description,
    canonical: new URL(path, import.meta.env.PUBLIC_SITE_URL).toString()
  };
}
```

```ts
export function validateContactPayload(input: Record<string, unknown>) {
  if (typeof input.name !== "string" || input.name.trim().length < 2) throw new Error("Invalid name");
  if (typeof input.email !== "string" || !input.email.includes("@")) throw new Error("Invalid email");
  if (typeof input.message !== "string" || input.message.trim().length < 10) throw new Error("Invalid message");
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    intent: typeof input.intent === "string" ? input.intent : "general",
    message: input.message.trim()
  };
}
```

```astro
---
const seo = buildSeo({
  title: "Contacto | Kontinu",
  description: "Conversemos sobre servicios DevOps, cloud o bootcamps para tu equipo.",
  path: "/contacto"
});
---
<BaseLayout seo={seo}>
  <h1>Contacto</h1>
  <form method="post" action="/api/contact">
    <input name="name" />
    <input name="email" />
    <textarea name="message" />
    <button type="submit">Enviar</button>
  </form>
</BaseLayout>
```

- [ ] **Step 4: Run tests, build, and static asset verification**

Run:

```bash
pnpm --filter @kontinu/web test
pnpm --filter @kontinu/web test:e2e -- contact.spec.ts blog.spec.ts
pnpm --filter @kontinu/web build
```

Expected:
- unit and E2E checks pass
- contact route validates cleanly
- blog pages and metadata compile

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/seo.ts apps/web/src/pages/nosotros.astro apps/web/src/pages/contacto.astro apps/web/src/pages/blog apps/web/src/pages/api/contact.ts apps/web/e2e/contact.spec.ts apps/web/e2e/blog.spec.ts apps/web/public
git commit -m "feat: add supporting pages, SEO, and contact flow"
```

## Task 6: Finish deployment wiring, redirect planning, docs, and release verification

**Files:**
- Create: `vercel.json`
- Create: `docs/migration/kontinu-url-map.md`
- Modify: `README.md`
- Modify: `.env.example`
- Modify: `apps/web/package.json`
- Modify: `apps/web/astro.config.mjs`

- [ ] **Step 1: Write failing verification tasks for production readiness**

Run:

```bash
pnpm validate
pnpm --filter @kontinu/web build
```

Expected:
- build may fail on missing adapter, missing env docs, or unresolved deployment settings
- redirect plan and launch notes do not yet exist

- [ ] **Step 2: Implement the deployment and migration configuration**

```json
{
  "framework": null,
  "buildCommand": "pnpm --filter @kontinu/web build",
  "outputDirectory": "apps/web/dist",
  "redirects": [
    { "source": "/automation.html", "destination": "/servicios/automatizacion", "permanent": true },
    { "source": "/docker.html", "destination": "/servicios/docker-containers", "permanent": true }
  ]
}
```

```md
# Kontinu URL Map

| Legacy URL | New URL | Notes |
| --- | --- | --- |
| `/automation.html` | `/servicios/automatizacion` | Keep service intent |
| `/docker.html` | `/servicios/docker-containers` | Preserve Docker keyword relevance |
| `/about.html` | `/nosotros` | Direct content migration |
```

```md
## Local development
- `pnpm install`
- `docker compose up web studio`

## Validation
- `pnpm validate`
- `pnpm --filter @kontinu/web test:e2e`
```

- [ ] **Step 3: Run full verification**

Run:

```bash
pnpm validate
pnpm --filter @kontinu/web test:e2e
docker compose up --build web studio
```

Expected:
- local validation passes
- core E2E routes pass
- Docker hot reload stack starts for both Astro and Sanity

- [ ] **Step 4: Capture manual verification checklist**

Add to `README.md` or release notes:

```md
- Verify homepage CTA split on desktop and mobile
- Verify service pages route to proposal or call intents
- Verify bootcamp pages route to enrollment or interest intents
- Verify canonical tags and social metadata
- Verify redirects for legacy URLs before Vercel cutover
```

- [ ] **Step 5: Commit**

```bash
git add vercel.json docs/migration/kontinu-url-map.md README.md .env.example apps/web/package.json apps/web/astro.config.mjs
git commit -m "chore: finalize deployment and migration readiness"
```

## Self-Review

### Spec coverage

- Parallel rebuild without disturbing the current Jekyll site: covered by `apps/web` and `apps/studio` workspace structure in Tasks 1 and 6
- `Astro + Sanity + Vercel` stack: covered by Tasks 1, 2, and 6
- Spanish-first corporate-modern shell with mixed CTA model: covered by Tasks 3, 4, and 5
- Services and bootcamps as equal primary tracks: covered by Tasks 3 and 4
- Docker and `docker compose` hot reload from day 1: covered by Tasks 1 and 6
- Contact modernization and Vercel-safe flow: covered by Task 5
- Deferred social proof: intentionally excluded from the task list per spec

### Placeholder scan

- No `TODO`, `TBD`, or deferred implementation placeholders are left in the task steps
- Every task includes exact files, concrete commands, and expected verification outcomes

### Type consistency

- The plan consistently uses `@kontinu/web` and `@kontinu/studio` workspace names
- Route names consistently use `/servicios`, `/bootcamps`, `/nosotros`, `/blog`, and `/contacto`
- CTA naming is consistent across shell, content model, and page tasks
