import { z, path } from "@src/mod.ts";

import * as util from "@src/util/util.ts";

import * as t from "@common/types.ts";

const SchemaPodsJson = z.object({
	pods: z.record(t.Uuid, t.Pod.omit({ uuid: true })),
});
type SchemaPodsJson_t = z.infer<typeof SchemaPodsJson>;

const SchemaCollectionsJson = z.object({
	collections: z.record(t.Uuid, t.Collection.omit({ uuid: true })),
});
type SchemaCollectionsJson_t = z.infer<typeof SchemaCollectionsJson>;

export function getPodsDir(): string {
	return path.join(util.getDataDir(), "pods");
}

export function getCollectionsDir(): string {
	return path.join(util.getDataDir(), "collections");
}

export function getPodDir(uuid: string): string {
	return path.join(getPodsDir(), uuid.slice(0, 2), uuid.slice(2));
}

export function getCollectionDir(uuid: string): string {
	return path.join(getCollectionsDir(), uuid.slice(0, 2), uuid.slice(2));
}

export function getPodsJsonFile(): string {
	return path.join(util.getDataDir(), "pods.json");
}

export function getCollectionsJsonFile(): string {
	return path.join(util.getDataDir(), "collections.json");
}

export async function getPodsJson(): Promise<SchemaPodsJson_t> {
	const jsonFile = getPodsJsonFile();
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

	return util.validateSchema<typeof SchemaPodsJson>(
		JSON.parse(content),
		SchemaPodsJson
	);
}

export async function getCollectionsJson(): Promise<SchemaCollectionsJson_t> {
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

	return util.validateSchema<typeof SchemaCollectionsJson>(
		JSON.parse(content),
		SchemaCollectionsJson
	);
}
