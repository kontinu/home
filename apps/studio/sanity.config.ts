import { defineConfig } from "sanity";

import { schemaTypes } from "./schemaTypes";

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.PUBLIC_SANITY_PROJECT_ID ??
  "ppsg7ml5";

const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.PUBLIC_SANITY_DATASET ??
  "production";

export default defineConfig({
  name: "default",
  title: "Kontinu Studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes
  }
});
