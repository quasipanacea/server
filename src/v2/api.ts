import * as util from "./util.ts";
import * as dir from "./dir.ts";
import * as file from "./file.ts";
import { path } from "../mod.ts";
import * as schema from "../../../common/schemaV2.ts";

type ResultOk<T> = { ok: true; data: T };
type ResultNotOk = { ok: false; error: Error };
type Result<T> = Promise<ResultOk<T> | ResultNotOk>;

function ok<T>(data: T): ResultOk<T> {
	return { ok: true, data };
}

function notok(error: Error): ResultNotOk {
	return { ok: false, error };
}

//
//
// Area
export async function areaAdd(name: string): Result<schema.areaAdd_resT> {
	const dirname = util.getAreaDir(name);

	const result = await dir.add(dirname);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function areaRemove(name: string): Result<schema.areaRemove_resT> {
	const dirname = util.getAreaDir(name);

	const result = await dir.remove(dirname);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function areaRename(
	oldName: string,
	newName: string
): Result<schema.areaRename_resT> {
	const oldDirname = util.getAreaDir(oldName);
	const newDirname = util.getAreaDir(newName);

	const result = await dir.rename(oldDirname, newDirname);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function areaList(): Result<schema.areaList_resT> {
	const dirname = util.getDefaultDir();

	const result = await dir.list(dirname);
	if (result instanceof Error) return notok(result);

	return ok({ areas: result });
}

//
//
// Topic
export async function topicAdd(
	area: string,
	name: string
): Result<schema.topicAdd_resT> {
	const dirname = util.getTopicDir(area, name);

	const result = await dir.add(dirname);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function topicRemove(
	area: string,
	name: string
): Result<schema.topicRemove_resT> {
	const dirname = util.getTopicDir(area, name);

	const result = await dir.remove(dirname);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function topicRename(
	area: string,
	oldName: string,
	newName: string
): Result<schema.topicRename_resT> {
	const oldDirname = util.getTopicDir(area, oldName);
	const newDirname = util.getTopicDir(area, newName);

	const result = await dir.rename(oldDirname, newDirname);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function topicList(area: string): Result<schema.topicList_resT> {
	const dirname = util.getAreaDir(area);

	const result = await dir.list(dirname);
	if (result instanceof Error) return notok(result);

	return ok({ galaxies: result });
}

//
//
// note
export async function noteAdd(
	area: string,
	topic: string,
	name: string
): Result<schema.noteAdd_resT> {
	const filename = util.getNoteFile(area, topic, name);

	const result = await dir.add(filename);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function noteRemove(
	area: string,
	topic: string,
	name: string
): Result<schema.noteRemove_resT> {
	const filename = util.getNoteFile(area, topic, name);

	const result = await dir.remove(filename);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function noteRename(
	area: string,
	topic: string,
	oldName: string,
	newName: string
): Result<schema.noteRename_resT> {
	const oldFilename = util.getNoteFile(area, topic, oldName);
	const newFilename = util.getNoteFile(area, topic, newName);

	const result = await dir.rename(oldFilename, newFilename);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function noteRead(
	area: string,
	topic: string,
	name: string
): Result<schema.noteRead_resT> {
	const filename = util.getNoteFile(area, topic, name);

	const result = await file.read(filename);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function noteWrite(
	area: string,
	topic: string,
	name: string,
	content: string
): Result<schema.noteWrite_resT> {
	const filename = util.getNoteFile(area, topic, name);

	const result = await file.write(filename, content);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function noteQuery(
	area: string,
	topic: string,
	query: string
): Result<schema.noteQuery_resT> {
	const root = util.getTopicDir(area, topic);

	const result = await file.query(root);
	if (result instanceof Error) return notok(result);

	return ok(result);
}

export async function noteList(
	area: string,
	topic: string
): Result<schema.noteList_resT> {
	const root = util.getTopicDir(area, topic);

	const result = await dir.list(root);
	if (result instanceof Error) return notok(result);

	return ok({ notes: result });
}
