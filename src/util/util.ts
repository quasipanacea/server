import { path, z, Context, fs } from "../mod.ts";
import { vars } from "./vars.ts";
import * as sendUtils from "./sendUtils.ts";

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

// For documents
export function getDocumentsDir() {}

export function getFileFromName(name: string) {
	return path.join(vars.documentsDir, `${name}.md`);
}
export function idTofilename(id: string) {
	return `${id}.txt`;
}

export function pathFromId(id: string) {
	return path.join(vars.documentsDir, `${id}.txt`);
}

export function handleError(error: unknown) {
	if (!(error instanceof Error)) {
		return new Error("Unknown error");
	}

	return error;
}
// For unique documents
export function getFileFromId(app: string, id: string) {
	return path.join(vars.documentsDir, "__uniques", app, `${id}.md`);
}

export function filenameToName(filename: string) {
	return filename.slice(0, filename.indexOf("."));
}

export async function extractData<T>(
	ctx: Context,
	schema: z.AnyZodObject
): Promise<
	| {
			success: false;
			data: { error: string | z.inferFormattedError<typeof schema> };
	  }
	| { success: true; data: T }
> {
	const body = await ctx.request.body({ type: "text" }).value;
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
	const schemaResult = await extractData<T>(ctx, schema);
	if (!schemaResult.success) {
		sendUtils.error(ctx, schemaResult.data);
		return null;
	}

	return schemaResult.data;
}
