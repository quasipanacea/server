import { z } from "@src/mod.ts";

export const schemaPodsJson = z.object({
	pods: z.record(
		z.string().min(1),
		z.object({
			type: z.string().min(1),
			name: z.string().min(1),
		})
	),
});

export const schemaPluginToml = z.object({
	type: z.string().min(1),
});
