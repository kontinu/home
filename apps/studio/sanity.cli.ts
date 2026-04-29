import { defineCliConfig } from "sanity/cli";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.PUBLIC_SANITY_PROJECT_ID ??
  "mbug6i3o";

const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.PUBLIC_SANITY_DATASET ??
  "production";

const apiVersion =
  process.env.SANITY_STUDIO_API_VERSION ??
  process.env.PUBLIC_SANITY_API_VERSION ??
  "2025-01-01";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
    apiVersion
  }
});
