import { UnknownError } from "../error.ts";
import { path } from "../mod.ts";
import * as util from "./util.ts";

type DirResult<T = null> = Promise<T | Error>;

export async function add(dirpath: string): DirResult {
	try {
		await Deno.mkdir(dirpath, { recursive: true });
		return null;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}

export async function remove(dirpath: string): DirResult {
	try {
		await Deno.remove(dirpath, { recursive: true });
		return null;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}

export async function rename(
	oldDirpath: string,
	newDirpath: string
): DirResult {
	try {
		await Deno.rename(oldDirpath, newDirpath);
		return null;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}

export async function list(dirpath: string): DirResult<string[]> {
	try {
		const dirs = [];

		for await (const entry of Deno.readDir(dirpath)) {
			dirs.push(entry.name);
		}

		return dirs;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}
