import { UnknownError } from "../error.ts";
import { fs } from "../mod.ts";

type FileResult<T = null> = Promise<T | Error>;

export async function read(filepath: string): FileResult<string> {
	try {
		const content = await Deno.readTextFile(filepath);
		return content;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}

export async function write(filepath: string, content: string): FileResult {
	try {
		await Deno.writeTextFile(filepath, content);
		return null;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}

type queryT = "does-exist";
export async function query(
	filepath: string,
	query: queryT
): FileResult<string> {
	switch (query) {
		case "does-exist": {
			const exists = await fs.exists(filepath);
			return exists ? "yes" : "no";
		}
	}
}
