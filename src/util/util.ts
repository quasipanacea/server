import { path, z, Context, fs, helpers } from "../mod.ts";
import { config } from "../config.ts";
import * as send from "./send.ts";
import * as schema from "../../common/schema.ts";
import { Status } from "https://deno.land/std@0.152.0/http/http_status.ts";
import { UnknownError } from "../error.ts";

export async function recursiveReaddir(filePath: string) {
	const files: string[] = [];
	const getFiles = async (filePath: string) => {
		for await (const dirEntry of Deno.readDir(filePath)) {
			if (dirEntry.isDirectory) {
				await getFiles(path.join(filePath, dirEntry.name));
			} else if (dirEntry.isFile) {
				files.push(path.join(filePath, dirEntry.name));
			}
		}
	};
	await getFiles(filePath);
	return files;
}

export async function exists(filePath: string) {
	return await fs.exists(filePath);
}

export function toSingleDir() {
	return path.join(config.documentsDir, "single");
}

export function toCoupleDir(channel: string) {
	return path.join(config.documentsDir, "coupled", channel);
}

export function toFilename(name: string) {
	return `${name}.md`;
}

export function filenameToName(filename: string) {
	return filename.slice(0, filename.indexOf("."));
}

export function extractData<T>(
	body: string,
	schema: z.AnyZodObject
):
	| {
			success: false;
			data: { error: string | z.inferFormattedError<typeof schema> };
	  }
	| { success: true; data: T } {
	try {
		const json = JSON.parse(body);
		const result = schema.safeParse(json);
		if (!result.success) {
			return { success: false, data: { error: result.error.format() } };
		}
		return { success: true, data: json };
	} catch {
		return {
			success: false,
			data: { error: "Failed to parse and validate JSON" },
		};
	}
}

export async function extractRequest<T>(
	ctx: Context,
	schema: z.AnyZodObject
): Promise<T | null> {
	try {
		const body = await ctx.request.body({ type: "text" }).value;
		const schemaResult = await extractData<T>(body, schema);
		if (!schemaResult.success) {
			send.error(ctx, schemaResult.data);
			return null;
		}

		return schemaResult.data;
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			send.error(ctx, new UnknownError(err));
			return null;
		}

		send.error(ctx, err);
		return null;
	}
}

export async function onKind(
	ctx: Context,
	{
		single: singleFn,
		couple: coupleFn,
	}: { single: () => void; couple: () => void }
) {
	const kind = ctx.request.url.searchParams.get("kind");
	if (!kind) {
		ctx.response.body = { error: "Missing query parameter: kind" };
		ctx.response.status = Status.NotAcceptable;
		return;
	}
	switch (kind) {
		case schema.documentKinds.enum.KindSingle:
			await singleFn();
			break;
		case schema.documentKinds.enum.KindCoupled:
			await coupleFn();
			break;
		default:
			ctx.response.body = { error: `Invalid query parameter: ${kind}` };
			ctx.response.status = Status.NotAcceptable;
			break;
	}
}
