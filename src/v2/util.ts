import { Context, z, path, fs } from "../mod.ts";
import * as send from "./send.ts";
import { UnknownError } from "../error.ts";
import { config } from "../config.ts";

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

export async function unwrap<T>(
	ctx: Context,
	schema: z.AnyZodObject
): Promise<T | null> {
	let body;
	try {
		body = await ctx.request.body({ type: "text" }).value;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return sendUnknownError(ctx, err);
		return send.error(ctx, err);
	}

	let json;
	try {
		json = JSON.parse(body);
	} catch (err: unknown) {
		if (!(err instanceof Error)) return sendUnknownError(ctx, err);
		return send.error(ctx, err);
	}

	let result;
	try {
		result = schema.strict().safeParse(json);
	} catch (err: unknown) {
		if (!(err instanceof Error)) return sendUnknownError(ctx, err);
		return send.error(ctx, err);
	}

	if (!result.success) {
		return send.error(ctx, result.error.format());
	}

	return json;
}

export function sendUnknownError(ctx: Context, err: unknown) {
	send.error(ctx, new UnknownError(err));
	return null;
}
