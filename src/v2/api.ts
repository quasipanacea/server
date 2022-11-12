import * as schema from "../../../common/schemaV2.ts";
import { config } from "../config.ts";
import * as util from "./util.ts";
import * as dir from "./dir.ts";

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
	const root = util.getDefaultDir();

	const result = await dir.add(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function areaRemove(name: string): Result<schema.areaRemove_resT> {
	const root = util.getDefaultDir();

	const result = await dir.remove(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function areaRename(
	oldName: string,
	newName: string
): Result<schema.areaRename_resT> {
	const root = util.getDefaultDir();

	const result = await dir.rename(root, oldName, newName);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function areaList(): Result<schema.areaList_resT> {
	const root = util.getDefaultDir();

	const result = await dir.list(root);
	if (result instanceof Error) return notok(result);

	return ok({ areas: result });
}

//
//
// Topic
export async function topicAdd(
	group: string,
	name: string
): Result<schema.topicAdd_resT> {
	const root = util.getAreaDir(group);

	const result = await dir.add(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function topicRemove(
	group: string,
	name: string
): Result<schema.topicRemove_resT> {
	const root = util.getAreaDir(group);

	const result = await dir.remove(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function topicRename(
	group: string,
	oldName: string,
	newName: string
): Result<schema.topicRename_resT> {
	const root = util.getAreaDir(group);

	const result = await dir.rename(root, oldName, newName);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function topicList(group: string): Result<schema.topicList_resT> {
	const root = util.getAreaDir(group);

	const result = await dir.list(root);
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
	const root = util.getTopicDir(area, topic);

	const result = await dir.add(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function noteRemove(
	area: string,
	topic: string,
	name: string
): Result<schema.noteRemove_resT> {
	const root = util.getTopicDir(area, topic);

	const result = await dir.remove(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function noteRename(
	area: string,
	topic: string,
	oldName: string,
	newName: string
): Result<schema.noteRename_resT> {
	const root = util.getTopicDir(area, topic);

	const result = await dir.rename(root, oldName, newName);
	if (result instanceof Error) return notok(result);

	return ok({});
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
