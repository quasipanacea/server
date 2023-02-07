import { path, z } from "@src/mod.ts";

import * as util from "@src/util/util.ts";
import * as schemas from "@src/verify/schemas.ts";

export function getPodDir(uuid: string): string {
	return path.join(
		path.join(util.getDataDir(), "pods"),
		uuid.slice(0, 2),
		uuid.slice(2)
	);
}

export function getCollectionDir(uuid: string): string {
	return path.join(
		path.join(util.getDataDir(), "collections"),
		uuid.slice(0, 2),
		uuid.slice(2)
	);
}

export function getPodsJsonFile(): string {
	return path.join(util.getDataDir(), "pods.json");
}

export function getCollectionsJsonFile(): string {
	return path.join(util.getDataDir(), "collections.json");
}

export async function getPodsJson(): Promise<
	z.infer<typeof schemas.ResourceSchemaPods>
> {
	const jsonFile = getCollectionsJsonFile();
	let content;
	try {
		content = await Deno.readTextFile(jsonFile);
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "pods": {} }';
			await Deno.writeTextFile(jsonFile, content);
		} else {
			throw err;
		}
	}

	return util.validateSchema<typeof schemas.ResourceSchemaPods>(
		JSON.parse(content),
		schemas.ResourceSchemaPods
	);
}

export async function getCollectionsJson(): Promise<
	z.infer<typeof schemas.ResourceSchemaCollections>
> {
	const jsonFile = getCollectionsJsonFile();
	let content;
	try {
		content = await Deno.readTextFile(jsonFile);
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "collections": {} }';
			await Deno.writeTextFile(jsonFile, content);
		} else {
			throw err;
		}
	}

	return util.validateSchema<typeof schemas.ResourceSchemaCollections>(
		JSON.parse(content),
		schemas.ResourceSchemaCollections
	);
}
