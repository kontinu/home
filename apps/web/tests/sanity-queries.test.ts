import { describe, expect, it } from "vitest";

import {
  SITE_SETTINGS_DOCUMENT_ID,
  bootcampBySlugQuery,
  bootcampsQuery,
  faqQuery,
  postBySlugQuery,
  postsQuery,
  serviceBySlugQuery,
  serviceCardProjection,
  servicesQuery,
  siteSettingsQuery
} from "../src/lib/sanity.queries";

describe("sanity queries", () => {
  it("includes the reusable service card projection fields", () => {
    expect(serviceCardProjection).toContain('"slug": slug.current');
    expect(serviceCardProjection).toContain("title");
    expect(serviceCardProjection).toContain("summary");
    expect(serviceCardProjection).toContain("primaryCta");
  });

  it("builds collection queries from the shared projection", () => {
    expect(servicesQuery).toContain('*[_type == "service"]');
    expect(servicesQuery).toContain(serviceCardProjection.trim());

    expect(bootcampsQuery).toContain('*[_type == "bootcamp"]');
    expect(bootcampsQuery).toContain('"slug": slug.current');
    expect(bootcampsQuery).toContain("summary");
    expect(bootcampsQuery).toContain("primaryCta");

    expect(postsQuery).toContain('*[_type == "post"]');
    expect(postsQuery).toContain('"slug": slug.current');
    expect(postsQuery).toContain("title");
    expect(postsQuery).toContain("summary");
  });

  it("builds detail queries with slug filters and rich content fields", () => {
    expect(serviceBySlugQuery).toContain(
      '*[_type == "service" && slug.current == $slug][0]'
    );
    expect(serviceBySlugQuery).toContain("body");
    expect(serviceBySlugQuery).toContain("primaryCta");

    expect(bootcampBySlugQuery).toContain(
      '*[_type == "bootcamp" && slug.current == $slug][0]'
    );
    expect(bootcampBySlugQuery).toContain("audience");
    expect(bootcampBySlugQuery).toContain("body");

    expect(postBySlugQuery).toContain(
      '*[_type == "post" && slug.current == $slug][0]'
    );
    expect(postBySlugQuery).toContain("publishedAt");
    expect(postBySlugQuery).toContain("body");
  });

  it("exports supporting singleton and FAQ queries", () => {
    expect(faqQuery).toContain('*[_type == "faq"]');
    expect(faqQuery).toContain("question");
    expect(faqQuery).toContain("answer");

    expect(SITE_SETTINGS_DOCUMENT_ID).toBe("siteSettings");
    expect(siteSettingsQuery).toContain(`_id == "${SITE_SETTINGS_DOCUMENT_ID}"`);
    expect(siteSettingsQuery).toContain("title");
    expect(siteSettingsQuery).toContain("primaryCta");
  });
});
