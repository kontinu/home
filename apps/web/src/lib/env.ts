type PublicEnvInput = Record<string, string | undefined>;

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

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value == null || value.trim() === "") {
    return fallback;
  }

  return value.trim().toLowerCase() !== "false";
}

export function parsePublicEnv(env: PublicEnvInput): PublicEnv {
  return {
    siteUrl: readRequiredValue(env, "PUBLIC_SITE_URL"),
    sanityProjectId: readRequiredValue(env, "PUBLIC_SANITY_PROJECT_ID"),
    sanityDataset: readRequiredValue(env, "PUBLIC_SANITY_DATASET"),
    sanityApiVersion: readRequiredValue(env, "PUBLIC_SANITY_API_VERSION"),
    sanityUseCdn: parseBoolean(env.PUBLIC_SANITY_USE_CDN, true)
  };
}

export function getPublicEnv() {
  return parsePublicEnv(import.meta.env);
}

