import { UnknownError } from "../error.ts";
import { path } from "../mod.ts";
import * as util from "./util.ts";

type DirResult<T = null> = Promise<T | Error>;

export async function add(root: string, dirname: string): DirResult {
	const dir = path.join(root, dirname);

	try {
		await Deno.mkdir(dir, { recursive: true });
		return null;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}

export async function remove(root: string, dirname: string): DirResult {
	const dir = path.join(root, dirname);

	try {
		await Deno.remove(dir, { recursive: true });
		return null;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}

export async function rename(
	root: string,
	oldDirname: string,
	newDirName: string
): DirResult {
	const dir1 = path.join(root, oldDirname);
	const dir2 = path.join(root, newDirName);

	try {
		await Deno.rename(dir1, dir2);
		return null;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}

export async function list(root: string): DirResult<string[]> {
	const dir = root;

	try {
		const dirs = [];

		for await (const entry of Deno.readDir(dir)) {
			dirs.push(entry.name);
		}

		return dirs;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return new UnknownError(err);
		return err;
	}
}
