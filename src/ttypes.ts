import { z } from "@src/mod.ts";
import * as t from "@common/types.ts";

export const SchemaPodsJson = z.object({
	pods: z.record(t.Uuid, t.Pod.omit({ uuid: true })),
});
export type SchemaPodsJson_t = z.infer<typeof SchemaPodsJson>;

export const SchemaCollectionsJson = z.object({
	collections: z.record(t.Uuid, t.Collection.omit({ uuid: true })),
});
export type SchemaCollectionsJson_t = z.infer<typeof SchemaCollectionsJson>;
