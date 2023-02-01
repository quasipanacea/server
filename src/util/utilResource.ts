import { path, z } from "../mod.ts";

import * as util from "@src/util/util.ts";

type ResourceKind = "collections" | "pods";

export function getResourceDir(kind: ResourceKind, uuid: string): string {
	return path.join(
		path.join(util.getDataDir(), kind),
		uuid.slice(0, 2),
		uuid.slice(2)
	);
}

export function getResourceJsonFile(kind: ResourceKind) {
	return path.join(util.getDataDir(), `${kind}.json`);
}

export async function getResourceJson<ResourceSchema extends z.AnyZodObject>(
	kind: ResourceKind,
	kindSchema: z.AnyZodObject
): Promise<z.infer<ResourceSchema>> {
	const jsonFile = getResourceJsonFile(kind);
	let content;
	try {
		content = await Deno.readTextFile(jsonFile);
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			switch (kind) {
				case "collections":
					content = '{ "collections": {} }';
					break;
				case "pods":
					content = '{ "pods": {} }';
					break;
			}
			await Deno.writeTextFile(jsonFile, content);
		} else {
			throw err;
		}
	}

	return util.validateSchema<ResourceSchema>(JSON.parse(content), kindSchema);
}
