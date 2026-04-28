import { describe, expect, it } from "vitest";

import { parsePublicEnv } from "../src/lib/env";

describe("parsePublicEnv", () => {
  it("returns the required public site and Sanity variables", () => {
    const env = parsePublicEnv({
      PUBLIC_SITE_URL: "https://www.kontinu.io",
      PUBLIC_SANITY_PROJECT_ID: "project123",
      PUBLIC_SANITY_DATASET: "production",
      PUBLIC_SANITY_API_VERSION: "2025-01-01"
    });

    expect(env).toEqual({
      siteUrl: "https://www.kontinu.io",
      sanityProjectId: "project123",
      sanityDataset: "production",
      sanityApiVersion: "2025-01-01",
      sanityUseCdn: true
    });
  });

  it("allows PUBLIC_SANITY_USE_CDN to disable the CDN", () => {
    const env = parsePublicEnv({
      PUBLIC_SITE_URL: "https://www.kontinu.io",
      PUBLIC_SANITY_PROJECT_ID: "project123",
      PUBLIC_SANITY_DATASET: "production",
      PUBLIC_SANITY_API_VERSION: "2025-01-01",
      PUBLIC_SANITY_USE_CDN: "false"
    });

    expect(env.sanityUseCdn).toBe(false);
  });

  it("accepts strict boolean values for PUBLIC_SANITY_USE_CDN", () => {
    expect(
      parsePublicEnv({
        PUBLIC_SITE_URL: "https://www.kontinu.io",
        PUBLIC_SANITY_PROJECT_ID: "project123",
        PUBLIC_SANITY_DATASET: "production",
        PUBLIC_SANITY_API_VERSION: "2025-01-01",
        PUBLIC_SANITY_USE_CDN: "true"
      }).sanityUseCdn
    ).toBe(true);
  });

  it("throws when a required public variable is missing", () => {
    expect(() =>
      parsePublicEnv({
        PUBLIC_SITE_URL: "https://www.kontinu.io",
        PUBLIC_SANITY_PROJECT_ID: "project123",
        PUBLIC_SANITY_API_VERSION: "2025-01-01"
      })
    ).toThrowError(/PUBLIC_SANITY_DATASET/i);
  });

  it("throws when PUBLIC_SITE_URL is not a valid URL", () => {
    expect(() =>
      parsePublicEnv({
        PUBLIC_SITE_URL: "not-a-url",
        PUBLIC_SANITY_PROJECT_ID: "project123",
        PUBLIC_SANITY_DATASET: "production",
        PUBLIC_SANITY_API_VERSION: "2025-01-01"
      })
    ).toThrowError(/PUBLIC_SITE_URL/i);
  });

  it("throws when PUBLIC_SANITY_API_VERSION is not a YYYY-MM-DD date", () => {
    expect(() =>
      parsePublicEnv({
        PUBLIC_SITE_URL: "https://www.kontinu.io",
        PUBLIC_SANITY_PROJECT_ID: "project123",
        PUBLIC_SANITY_DATASET: "production",
        PUBLIC_SANITY_API_VERSION: "2025/01/01"
      })
    ).toThrowError(/PUBLIC_SANITY_API_VERSION/i);
  });

  it("throws when PUBLIC_SANITY_USE_CDN uses an unknown value", () => {
    expect(() =>
      parsePublicEnv({
        PUBLIC_SITE_URL: "https://www.kontinu.io",
        PUBLIC_SANITY_PROJECT_ID: "project123",
        PUBLIC_SANITY_DATASET: "production",
        PUBLIC_SANITY_API_VERSION: "2025-01-01",
        PUBLIC_SANITY_USE_CDN: "maybe"
      })
    ).toThrowError(/PUBLIC_SANITY_USE_CDN/i);
  });
});
