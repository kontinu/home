# Kontinu Astro Redesign Design

## Goal

Rebuild `www.kontinu.io` as a modern marketing site that better represents Kontinu today, improves lead generation for consulting services, supports bootcamp promotion, and is easier to maintain and update over time.

The new site will replace the current Jekyll-based static site with a modern stack deployed on `Vercel`, while preserving only the core brand assets and selected content themes from the old site. The information architecture, copy, design system, and content workflow will all be redesigned from scratch.

## Product Direction

- Primary site role: hybrid company site for both consulting services and training/bootcamps
- Primary language: Spanish
- Technical terms that should remain in English where appropriate: `Docker`, `containers`, `Kubernetes`, `cloud`
- Visual direction: corporate modern
- Content scope: full rewrite, not a visual refresh of the existing structure
- Editorial workflow: hybrid, with core site structure in code and structured content managed through a CMS
- Launch strategy: phase 1 launches without testimonials or case studies; social proof is deferred to a later phase

## Recommended Stack

### Frontend

- `Astro` for the website application
- Component-driven page construction with reusable sections and layouts
- Fast static-first delivery with selective dynamic behavior only where needed

### CMS

- `Sanity` for structured content editing
- Content types for services, bootcamps, blog content, FAQ items, and company/about content
- The repo continues to own the layout system, design system, CTA logic, and SEO defaults

### Hosting and Delivery

- `Vercel` for preview deployments and production hosting
- Environment-aware deployments for local development, preview, and production

### Local Development

- `Docker` and `docker compose` support from day 1
- Frontend container with bind-mounted source code for hot reload
- Local workflow that allows design, copy, and layout changes to be previewed without requiring a custom machine-specific setup
- Production-like build verification available locally before deployment

## Why This Direction

`Astro + Sanity + Vercel` is the best fit for the target outcome because Kontinu needs a content-led, performance-focused marketing site rather than a JavaScript-heavy web application.

Compared with keeping the site static in-repo only, the hybrid CMS model makes future updates easier without forcing every content change through code edits. Compared with `Next.js`, Astro provides a simpler and lighter fit for a mostly static corporate site while still giving plenty of room for future growth.

## Information Architecture

The new site should be structured around a clear corporate funnel with two primary tracks: consulting services and training.

### Primary Navigation

- `Inicio`
- `Servicios`
- `Bootcamps`
- `Nosotros`
- `Blog`
- `Contacto`

### Homepage Role

The homepage should work as the primary routing surface for both target audiences:

- organizations looking for consulting support
- individuals or teams interested in bootcamps and training

The homepage should:

- establish a strong corporate first impression
- explain what Kontinu does in clear business language
- keep technical credibility through precise use of terms like `cloud`, `Docker`, `containers`, and `Kubernetes`
- introduce both main offers without making the site feel split or unfocused
- drive users toward the correct CTA based on intent

## Content Strategy

The existing site content should be treated as source material, not as the structure or copy to preserve.

### Content to Preserve

- logos and core brand assets
- service themes and subject-matter areas already represented in the current site
- useful technical positioning where still relevant

### Content to Replace

- homepage copy
- about/company copy
- service descriptions
- training/bootcamp messaging
- navigation wording where needed
- meta descriptions and SEO copy

### Editorial Principles

- Spanish-first writing with selective English technical terminology
- more polished and commercial copy than the current site
- more explicit articulation of outcomes and customer value
- clearer separation between consulting offers and training offers
- less legacy DevOps jargon where it does not help the buyer understand the offer

## Conversion Strategy

The site should use a mixed CTA model rather than a single universal CTA.

### Services CTAs

Service-oriented pages should optimize primarily for:

- `Agendar llamada`
- `Solicitar propuesta`

### Bootcamp CTAs

Bootcamp-oriented pages should optimize primarily for:

- `Inscribirme`
- `Solicitar informacion`
- `Lista de interes`

### Shared Site-Level Behavior

- the homepage should expose both paths clearly
- navigation and repeated CTAs should help visitors self-select their path
- contact flows should feel modern and Vercel-compatible rather than inherited from the current PHP or Formspree patterns

## Visual Design Direction

The redesign should feel current, credible, and enterprise-ready without becoming generic.

### Desired Traits

- clean and modern corporate presentation
- stronger typography and spacing rhythm
- clearer visual hierarchy
- more premium use of color and contrast
- fewer legacy Bootstrap-era visual patterns
- more deliberate calls to action and section framing

### Avoid

- a direct visual port of the current site
- dated card grids and modal-heavy patterns
- visual treatment that feels like an old Bootstrap template
- overly playful styling that weakens consulting credibility

## Content Model Boundaries

The new stack should clearly separate what lives in code and what lives in Sanity.

### Managed in Code

- layouts
- navigation structure
- page templates
- reusable sections and components
- design tokens
- CTA components and CTA logic
- default SEO behavior
- Vercel integration and deployment configuration
- Docker-based local development workflow

### Managed in Sanity

- services
- bootcamps
- FAQ entries
- blog posts or insights content
- about/company content blocks
- contact page content
- future testimonials and case studies

## Migration Strategy

The migration should be a parallel rebuild, not an in-place refactor of the Jekyll site.

### Recommended Approach

1. Keep the current site live during the rebuild.
2. Build the new Astro site in parallel.
3. Model structured content in Sanity.
4. Rewrite the copy for the new structure.
5. Deploy preview environments on Vercel.
6. Verify production build behavior, routing, metadata, and forms.
7. Cut over only when the new site is launch-ready.

### Why Parallel Rebuild

- avoids carrying old structure into the new platform
- reduces launch risk
- makes the redesign and rewrite possible without destabilizing the live site
- provides a clean path to new IA, new content, and new design patterns

## Launch Scope

### Phase 1

- new homepage
- services listing and service detail pages
- bootcamps listing and bootcamp detail pages
- about page
- contact page
- blog foundation
- migrated logos and selected brand assets
- rewritten copy across the site
- Vercel deployment setup
- Docker local development workflow with hot reload

### Deferred to Later Phase

- testimonials
- case studies
- broader social proof system
- additional advanced marketing content beyond the launch baseline

## Architecture Notes

The repo should become the source of truth for presentation and experience, while Sanity becomes the source of truth for structured marketing content. This keeps the design system version-controlled and predictable while making content changes much easier after launch.

The resulting architecture should support:

- maintainable section-based page building
- consistent styling and reusable components
- previewable editorial updates
- local-first development through Docker
- straightforward Vercel deployment

## Error Handling and Operational Considerations

- local development should fail clearly when required environment variables are missing
- preview and production content sources should be easy to distinguish
- content-driven pages should degrade gracefully if optional content is missing
- forms and CTA flows should use a deployment-compatible strategy that does not depend on the current PHP contact handler

## Testing and Verification Expectations

The implementation plan should include verification for:

- local `docker compose` development and hot reload
- production build success
- route coverage for the main site sections
- rendering of CMS-backed content
- metadata and SEO baseline correctness
- responsive behavior on mobile and desktop
- contact/CTA flow functionality

## Non-Goals

- preserving the old Jekyll structure
- shipping a visual clone of the current site
- building social proof features in the first launch
- introducing unnecessary application complexity beyond what a marketing site needs

