import { path, z } from "../mod.ts";
import * as util from "./util.ts";
import { vars } from "./vars.ts";
import { KnowledgeError } from "./KnowledgeError.ts";

type Result<T, U> = Promise<
	{ success: true; data: T } | { success: false; data: U }
>;

function resultTrue<T>(data: T): { success: true; data: T } {
	return { success: true, data };
}

function resultFalse<T>(data: T): { success: false; data: T } {
	return { success: false, data };
}

// document
export type documentCreateSchemaType = typeof documentCreateSchema;
const documentCreateSchema = z.object({
	name: z.string().min(1),
});

export async function documentCreate(
	name: string
): Result<null, KnowledgeError> {
	const file = await util.getFileFromName(name);
	if (await util.exists(file)) {
		return resultFalse(new KnowledgeError("document already exists"));
	} else {
		await Deno.writeTextFile(file, `# ${name}\n`);
		return resultTrue(null);
	}
}

export async function documentRead(
	name: string
): Result<string, KnowledgeError> {
	const file = await util.getFileFromName(name);
	try {
		const content = await Deno.readTextFile(file);
		return resultTrue(content);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new KnowledgeError("Unknown error"));
		}

		if (err instanceof Deno.errors.NotFound) {
			return resultFalse(new KnowledgeError("Failed to find document"));
		}

		return resultFalse(new KnowledgeError("Unaccounted error"));
	}
}

export async function documentWrite(
	name: string,
	content: string
): Result<null, KnowledgeError> {
	const file = await util.getFileFromName(name);
	try {
		await Deno.writeTextFile(file, content);
		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new KnowledgeError("Unknown error"));
		}

		return resultFalse(new KnowledgeError("Unaccounted error"));
	}
}

export async function documentDelete(
	name: string
): Result<null, KnowledgeError> {
	const file = await util.getFileFromName(name);
	try {
		await Deno.remove(file);
		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new KnowledgeError("Unknown error"));
		}

		return resultFalse(new KnowledgeError("Unaccounted error"));
	}
}

export async function documentList(): Result<
	{ name: string }[],
	KnowledgeError
> {
	const arr = [];
	try {
		for await (const stat of Deno.readDir(vars.documentsDir)) {
			if (!stat.isFile) {
				continue;
			}
			arr.push({
				name: util.filenameToName(stat.name),
			});
		}
		return resultTrue(arr);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new KnowledgeError("Unknown error"));
		}

		return resultFalse(new KnowledgeError("Unaccounted error"));
	}
}

// uniqueDocument
export async function uniqueDocumentCreate() {}

export async function uniqueDocumentRead(
	context: string,
	id: string
): Promise<[true, string] | [false, Error]> {
	const file = path.join(
		vars.documentsDir,
		"__unique",
		context,
		util.idTofilename(id)
	);

	try {
		const content = await Deno.readTextFile(file);
		return [true, content];
	} catch (error: unknown) {
		return [false, util.handleError(error)];
	}
}

export async function uniqueDocumentWrite(context: string, id: string) {}
export async function uniqueDocumentList(
	context: string
): Promise<{ name: string }[] | Error> {
	const uniqueDocumentsDir = path.join(vars.documentsDir, "__unique", context);

	const arr = [];
	try {
		for await (const stat of Deno.readDir(uniqueDocumentsDir)) {
			if (!stat.isFile) {
				continue;
			}

			arr.push({
				name: util.filenameToName(stat.name),
			});
		}
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return new Error("Unknown error");
		}

		return err;
	}

	return arr;
}
