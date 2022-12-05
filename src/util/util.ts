import { config } from "../config.ts";
import { JSONError } from "../error.ts";
import { path, Context, z } from "../mod.ts";
import * as send from "./send.ts";

export function getDataDir() {
	return path.join(config.documentsDir, "data");
}

export function getPodDir() {
	return path.join(getDataDir(), "pods");
}

export function getPodMetafile() {
	return path.join(getDataDir(), "pods.json");
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
