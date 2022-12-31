import { path, Context, z } from "@src/mod.ts";
import { config } from "@src/util/config.ts";

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
	validateSchema(json, schema);

	return json;
}

export function validateSchema<Schema extends z.AnyZodObject>(
	json: Record<string, unknown>,
	schema: z.AnyZodObject
): z.infer<Schema> {
	const result = schema.strict().safeParse(json);
	if (!result.success) {
		throw new JSONError(result.error.format());
	}
	return result;
}

export class JSONError extends Error {
	json: Record<string, unknown>;

	constructor(json: Record<string, unknown>) {
		super(`JSON Error: ${JSON.stringify(json, null, "\t")}`);
		this.name = this.constructor.name;
		this.json = json;
	}
}
