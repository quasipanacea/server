import { path, z, toml } from "@src/mod.ts";

import { config } from "@src/util/config.ts";
import * as utilResource from "@src/util/utilResource.ts";
import type * as t from "@common/types.ts";

export function jsonStringify(obj: Record<string, unknown>) {
	return JSON.stringify(obj, null, "\t");
}

export function tomlStringify(obj: Record<string, unknown>) {
	return toml.stringify(obj);
}

// misc
export function getPacksDir() {
	return path.join(Deno.cwd(), "common/packs");
}

export function getDataDir() {
	return path.join(config.documentsDir, "data");
}

export function validateSchema<Schema extends z.AnyZodObject>(
	obj: Record<string, unknown>,
	schema: z.AnyZodObject
): z.infer<Schema> {
	const result = schema.strict().safeParse(obj);
	if (!result.success) {
		throw new JSONError(result.error.format());
	}
	return result.data;
}

export async function getPod(uuid: string): Promise<t.Pod_t & { dir: string }> {
	const dir = utilResource.getPodDir(uuid);

	const podsJson = await utilResource.getPodsJson();
	const obj = podsJson.pods[uuid];

	if (!obj) {
		throw new Error(`Failed to find pod with id: ${uuid}`);
	}

	return {
		...obj,
		uuid,
		dir,
	};
}

export class JSONError extends Error {
	obj: Record<string, unknown>;

	constructor(
		obj: Record<string, unknown>,
		serializationType: "json" | "toml" = "json"
	) {
		let str = "???";
		switch (serializationType) {
			case "json":
				str = jsonStringify(obj);
				break;
			case "toml":
				str = tomlStringify(obj);
		}

		super(`JSON Error: ${str}`);

		this.name = this.constructor.name;
		this.obj = obj;
	}
}
