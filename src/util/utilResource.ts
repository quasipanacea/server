import { z, path } from "@src/mod.ts";

import * as util from "@src/util/util.ts";

import * as t from "@common/types.ts";

// types
const SchemaPodsJson = z.object({
	pods: z.record(t.Uuid, t.Pod.omit({ uuid: true })),
});
type SchemaPodsJson_t = z.infer<typeof SchemaPodsJson>;

const SchemaGroupsJson = z.object({
	groups: z.record(t.Uuid, t.Group.omit({ uuid: true })),
});
type SchemaGroupsJson_t = z.infer<typeof SchemaGroupsJson>;

const SchemaCoversJson = z.object({
	covers: z.record(t.Uuid, t.Cover.omit({ uuid: true })),
});
type SchemaCoversJson_t = z.infer<typeof SchemaCoversJson>;

// dir
export function getPodsDir(): string {
	return path.join(util.getDataDir(), "pods");
}

export function getCollectionsDir(): string {
	return path.join(util.getDataDir(), "collections");
}

export function getCoversDir(): string {
	return path.join(util.getDataDir(), "covers");
}

// file
export function getPodsJsonFile(): string {
	return path.join(util.getDataDir(), "pods.json");
}

export function getGroupsJsonFile(): string {
	return path.join(util.getDataDir(), "groups.json");
}

export function getCoversJsonFile(): string {
	return path.join(util.getDataDir(), "covers.json");
}

// dir (instance)
export function getPodDir(uuid: string): string {
	return path.join(getPodsDir(), uuid.slice(0, 2), uuid.slice(2));
}

export function getGroupDir(uuid: string): string {
	return path.join(getCollectionsDir(), uuid.slice(0, 2), uuid.slice(2));
}

export function getCoverDir(uuid: string): string {
	return path.join(getCoversDir(), uuid.slice(0, 2), uuid.slice(2));
}

// json
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

export async function getGroupsJson(): Promise<SchemaGroupsJson_t> {
	const jsonFile = getGroupsJsonFile();
	let content;
	try {
		content = await Deno.readTextFile(jsonFile);
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "groups": {} }';
			await Deno.writeTextFile(jsonFile, content);
		} else {
			throw err;
		}
	}

	return util.validateSchema<typeof SchemaGroupsJson>(
		JSON.parse(content),
		SchemaGroupsJson
	);
}

export async function getCoversJson(): Promise<SchemaCoversJson_t> {
	const jsonFile = getCoversJsonFile();
	let content;
	try {
		content = await Deno.readTextFile(jsonFile);
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			content = '{ "covers": {} }';
			await Deno.writeTextFile(jsonFile, content);
		} else {
			throw err;
		}
	}

	return util.validateSchema<typeof SchemaCoversJson>(
		JSON.parse(content),
		SchemaCoversJson
	);
}
