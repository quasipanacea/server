import { z } from "@src/mod.ts";
import { uuid_t, zodPod, zodCollection } from "@common/types.ts";

export const ResourceSchemaPods = z.object({
	pods: z.record(uuid_t, zodPod.omit({ uuid: true })),
});

export const ResourceSchemaCollections = z.object({
	collections: z.record(uuid_t, zodCollection.omit({ uuid: true })),
});
