type PublicEnvInput = Record<string, string | undefined>;

const SANITY_API_VERSION_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export type PublicEnv = {
  siteUrl: string;
  sanityProjectId: string;
  sanityDataset: string;
  sanityApiVersion: string;
  sanityUseCdn: boolean;
};

const REQUIRED_PUBLIC_KEYS = [
  "PUBLIC_SITE_URL",
  "PUBLIC_SANITY_PROJECT_ID",
  "PUBLIC_SANITY_DATASET",
  "PUBLIC_SANITY_API_VERSION"
] as const;

function readRequiredValue(
  env: PublicEnvInput,
  key: (typeof REQUIRED_PUBLIC_KEYS)[number]
) {
  const value = env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required public environment variable: ${key}`);
  }

  return value;
}

function parseSiteUrl(value: string) {
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    throw new Error(
      "Invalid public environment variable PUBLIC_SITE_URL: expected a valid URL"
    );
  }
}

function parseSanityApiVersion(value: string) {
  if (!SANITY_API_VERSION_PATTERN.test(value)) {
    throw new Error(
      "Invalid public environment variable PUBLIC_SANITY_API_VERSION: expected YYYY-MM-DD"
    );
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(
      "Invalid public environment variable PUBLIC_SANITY_API_VERSION: expected a real calendar date"
    );
  }

  return value;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value == null || value.trim() === "") {
    return fallback;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "true") {
    return true;
  }

  if (normalizedValue === "false") {
    return false;
  }

  throw new Error(
    "Invalid public environment variable PUBLIC_SANITY_USE_CDN: expected true or false"
  );
}

export function parsePublicEnv(env: PublicEnvInput): PublicEnv {
  return {
    siteUrl: parseSiteUrl(readRequiredValue(env, "PUBLIC_SITE_URL")),
    sanityProjectId: readRequiredValue(env, "PUBLIC_SANITY_PROJECT_ID"),
    sanityDataset: readRequiredValue(env, "PUBLIC_SANITY_DATASET"),
    sanityApiVersion: parseSanityApiVersion(
      readRequiredValue(env, "PUBLIC_SANITY_API_VERSION")
    ),
    sanityUseCdn: parseBoolean(env.PUBLIC_SANITY_USE_CDN, true)
  };
}

export function getPublicEnv() {
  return parsePublicEnv(import.meta.env);
}
