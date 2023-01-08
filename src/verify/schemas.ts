import { z } from "@src/mod.ts";

const uuid_t = z.string().min(1);

export const SchemaPodsJson = z.object({
	pods: z.record(
		uuid_t,
		z.object({
			handler: z.string().min(1),
			name: z.string().min(1),
		})
	),
});

export const SchemaPluginToml = z.object({
	name: z.string().min(1),
	namePretty: z.string().min(1),
});
