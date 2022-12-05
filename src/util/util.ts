import { config } from "../config.ts";
import { JSONError } from "../errors.ts";
import { path, Context, z } from "../mod.ts";

// flat
export function getDataDir() {
	return path.join(config.documentsDir, "data");
}

export function getPodDir() {
	return path.join(getDataDir(), "pods");
}

export function getPodMetafile() {
	return path.join(getDataDir(), "pods.json");
}

// hier
export function getDefaultDir() {
	return path.join(config.documentsDir, "Default");
}

export function getAreaDir(areaName: string) {
	return path.join(getDefaultDir(), areaName);
}

export function getTopicDir(areaName: string, topicName: string) {
	return path.join(getDefaultDir(), areaName, topicName);
}

export function getNoteDir(
	areaName: string,
	topicName: string,
	noteName: string
) {
	return path.join(getDefaultDir(), areaName, topicName, noteName);
}

export function getNoteFile(
	areaName: string,
	topicName: string,
	noteName: string
) {
	return path.join(getNoteDir(areaName, topicName, noteName), `${noteName}.md`);
}

export async function dirlist(dirpath: string): Promise<string[]> {
	const dirs = [];

	for await (const entry of Deno.readDir(dirpath)) {
		dirs.push(entry.name);
	}

	return dirs;
}

export async function unwrap<T>(
	ctx: Context,
	schema: z.AnyZodObject
): Promise<T> {
	const body = await ctx.request.body({ type: "text" }).value;
	const json = JSON.parse(body);
	const result = schema.strict().safeParse(json);

	if (!result.success) {
		throw new JSONError(result.error.format());
	}

	return json;
}
