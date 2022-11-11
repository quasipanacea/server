import { fs, path } from "../mod.ts";
import * as util from "./util.ts";
import { log } from "../util/logger.ts";
import * as error from "../error.ts";

type Result<T, U> = Promise<
	{ success: true; data: T } | { success: false; data: U }
>;

function resultTrue<T>(data: T): { success: true; data: T } {
	return { success: true, data };
}

function resultFalse<T>(data: T): { success: false; data: T } {
	return { success: false, data };
}

// GROUP
export async function groupList(): Result<string[], Error> {
	try {
		const dir_raw = util.toCoupleDirRaw();

		const dirs = [];
		for await (const entry of Deno.readDir(dir_raw)) {
			dirs.push(entry.name);
		}

		return resultTrue(dirs);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		return resultFalse(err);
	}
}

export async function groupCreate(name: string): Result<null, Error> {
	try {
		const dir_raw = util.toCoupleDirRaw();

		const dir = path.join(dir_raw, name);
		await fs.ensureDir(dir);

		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		return resultFalse(err);
	}
}

export async function groupDelete(name: string): Result<null, Error> {
	try {
		const dir_raw = util.toCoupleDirRaw();

		const dir = path.join(dir_raw, name);
		await Deno.remove(dir, { recursive: true });

		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		return resultFalse(err);
	}
}

export async function groupRename(
	oldName: string,
	newName: string
): Result<null, Error> {
	try {
		const dir_raw = util.toCoupleDirRaw();

		const old_dir = path.join(dir_raw, oldName);
		const new_dir = path.join(dir_raw, newName);
		await Deno.rename(old_dir, new_dir);

		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		return resultFalse(err);
	}
}

/* ---------------------- document ---------------------- */

// create single
export async function documentCreateSingle(name: string): Result<null, Error> {
	const dir = util.toSingleDir();
	const file = path.join(dir, util.toFilename(name));

	if (await util.exists(file)) {
		return resultFalse(new error.DocumentAlreadyExistsError(file));
	} else {
		try {
			await Deno.mkdir(path.dirname(file), { recursive: true });
			await Deno.writeTextFile(file, `# ${name}\n`);
			log(`File write: ${file}`);

			return resultTrue(null);
		} catch (err: unknown) {
			if (!(err instanceof Error)) {
				return resultFalse(new error.UnknownError(err));
			}

			return resultFalse(err);
		}
	}
}

// create coupled
export async function documentCreateCouple(
	channel: string,
	name: string
): Result<null, Error> {
	const dir = util.toCoupleDir(channel);
	const file = path.join(dir, util.toFilename(name));

	if (await util.exists(file)) {
		return resultFalse(new error.DocumentAlreadyExistsError(file));
	} else {
		try {
			await Deno.mkdir(path.dirname(file), { recursive: true });
			await Deno.writeTextFile(file, `# ${name}\n`);
			log(`File write: ${file}`);

			return resultTrue(null);
		} catch (err: unknown) {
			if (!(err instanceof Error)) {
				return resultFalse(new error.UnknownError(err));
			}

			return resultFalse(err);
		}
	}
}

// read single
export async function documentReadSingle(name: string): Result<string, Error> {
	const dir = util.toSingleDir();
	const file = path.join(dir, util.toFilename(name));

	try {
		const content = await Deno.readTextFile(file);
		log(`File read: ${file}`);

		return resultTrue(content);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		if (err instanceof Deno.errors.NotFound) {
			return resultFalse(new error.DocumentDoesNotExistError(file));
		}

		return resultFalse(err);
	}
}

// read couple
export async function documentReadCouple(
	channel: string,
	id: string
): Result<string, Error> {
	const dir = util.toCoupleDir(channel);
	const file = path.join(dir, util.toFilename(id));

	try {
		const content = await Deno.readTextFile(file);
		log(`File read: ${file}`);

		return resultTrue(content);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		if (err instanceof Deno.errors.NotFound) {
			return resultFalse(new error.DocumentDoesNotExistError(file));
		}

		return resultFalse(err);
	}
}

// write single
export async function documentWriteSingle(
	name: string,
	content: string
): Result<null, Error> {
	const dir = util.toSingleDir();
	const file = path.join(dir, util.toFilename(name));

	try {
		await Deno.writeTextFile(file, content);
		log(`File write: ${file}`);

		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		return resultFalse(err);
	}
}

// write couple
export async function documentWriteCouple(
	channel: string,
	id: string,
	content: string
): Result<null, Error> {
	const dir = util.toCoupleDir(channel);
	const file = path.join(dir, util.toFilename(id));

	try {
		await Deno.writeTextFile(file, content);
		log(`File write: ${file}`);

		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		return resultFalse(err);
	}
}

// rename single
export async function documentRenameSingle(
	oldName: string,
	newName: string
): Result<null, Error> {
	const dir = util.toSingleDir();
	const oldFile = path.join(dir, util.toFilename(oldName));
	const newFile = path.join(dir, util.toFilename(newName));

	if (await fs.exists(newFile)) {
		return resultFalse(new error.DocumentAlreadyExistsError(newFile));
	}

	try {
		await Deno.rename(oldFile, newFile);

		return resultTrue(null);
	} catch (err) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		if (err instanceof Deno.errors.AlreadyExists) {
			return resultFalse(new error.DocumentAlreadyExistsError(newFile));
		}

		return resultFalse(err);
	}
}

// rename couple
export async function documentRenameCouple(
	channel: string,
	oldId: string,
	newId: string
): Result<null, Error> {
	const dir = util.toCoupleDir(channel);
	const oldFile = path.join(dir, util.toFilename(oldId));
	const newFile = path.join(dir, util.toFilename(newId));

	if (await fs.exists(newFile)) {
		return resultFalse(new error.DocumentAlreadyExistsError(newFile));
	}

	try {
		await Deno.rename(oldFile, newFile);

		return resultTrue(null);
	} catch (err) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		if (err instanceof Deno.errors.AlreadyExists) {
			return resultFalse(new error.DocumentAlreadyExistsError(newFile));
		}

		return resultFalse(err);
	}
}

// delete single
export async function documentDeleteSingle(name: string): Result<null, Error> {
	const dir = util.toSingleDir();
	const file = path.join(dir, util.toFilename(name));

	try {
		await Deno.remove(file);
		log(`File delete: ${file}`);

		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		return resultFalse(err);
	}
}

// delete couple
export async function documentDeleteCouple(
	channel: string,
	id: string
): Result<null, Error> {
	const dir = util.toCoupleDir(channel);
	const file = path.join(dir, util.toFilename(id));

	try {
		await Deno.remove(file);
		log(`File delete: ${file}`);

		return resultTrue(null);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		return resultFalse(err);
	}
}

// list single
export async function documentListSingle(): Result<{ name: string }[], Error> {
	const dir = util.toSingleDir();

	const arr = [];
	try {
		for await (const stat of Deno.readDir(dir)) {
			if (stat.isFile) {
				arr.push({
					name: util.filenameToName(stat.name),
				});
			}
		}
		log(`File list: ${dir}`);
		return resultTrue(arr);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		if (err instanceof Deno.errors.NotFound) {
			return resultTrue([]);
		}

		return resultFalse(err);
	}
}

// list couple
export async function documentListCouple(
	channel: string
): Result<{ name: string }[], Error> {
	const dir = util.toCoupleDir(channel);

	const arr = [];
	try {
		for await (const stat of Deno.readDir(dir)) {
			if (stat.isFile) {
				arr.push({
					name: util.filenameToName(stat.name),
				});
			}
		}
		log(`File list: ${dir}`);
		return resultTrue(arr);
	} catch (err: unknown) {
		if (!(err instanceof Error)) {
			return resultFalse(new error.UnknownError(err));
		}

		if (err instanceof Deno.errors.NotFound) {
			return resultTrue([]);
		}

		return resultFalse(err);
	}
}

// query single
export async function documentQuerySingle(
	name: string,
	query: string
): Result<string, Error> {
	const dir = util.toSingleDir();
	const file = path.join(dir, util.toFilename(name));

	if (query === "does-exist") {
		if (await fs.exists(file)) {
			return resultTrue("yes");
		} else {
			return resultTrue("no");
		}
	}

	return resultFalse(new Error("query is not of the allowed variant"));
}

// query couple
export async function documentQueryCouple(
	channel: string,
	id: string,
	query: string
): Result<string, Error> {
	const dir = util.toCoupleDir(channel);
	const file = path.join(dir, util.toFilename(id));

	if (query === "does-exist") {
		if (await fs.exists(file)) {
			return resultTrue("yes");
		} else {
			return resultTrue("no");
		}
	}

	return resultFalse(new Error("query is not of the allowed variant"));
}
