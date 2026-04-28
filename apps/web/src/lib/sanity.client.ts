import { createClient } from "@sanity/client";

import { getPublicEnv } from "./env";

const env = getPublicEnv();

export const sanityClient = createClient({
  projectId: env.sanityProjectId,
  dataset: env.sanityDataset,
  apiVersion: env.sanityApiVersion,
  useCdn: env.sanityUseCdn
});

