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
// Galaxy Group
export async function galaxyGroupAdd(
	name: string
): Result<schema.galaxyGroupAdd_resT> {
	const root = util.getGalaxyClusterDir();

	const result = await dir.add(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function galaxyGroupRemove(
	name: string
): Result<schema.galaxyGroupRemove_resT> {
	const root = util.getGalaxyClusterDir();

	const result = await dir.remove(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function galaxyGroupRename(
	oldName: string,
	newName: string
): Result<schema.galaxyGroupRename_resT> {
	const root = util.getGalaxyClusterDir();

	const result = await dir.rename(root, oldName, newName);
	if (result instanceof Error) return notok(result);

	return ok({});
}

export async function galaxyGroupList(): Result<schema.galaxyGroupList_resT> {
	const root = util.getGalaxyClusterDir();

	const result = await dir.list(root);
	if (result instanceof Error) return notok(result);

	return ok({ galaxyGroups: result });
}

//
//
// Galaxy
export async function galaxyAdd(
	group: string,
	name: string
): Result<schema.galaxyAdd_resT> {
	const root = util.getGalaxyGroupDir(group);

	const result = await dir.add(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function galaxyRemove(
	group: string,
	name: string
): Result<schema.galaxyRemove_resT> {
	const root = util.getGalaxyGroupDir(group);

	const result = await dir.remove(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function galaxyRename(
	group: string,
	oldName: string,
	newName: string
): Result<schema.galaxyRename_resT> {
	const root = util.getGalaxyGroupDir(group);

	const result = await dir.rename(root, oldName, newName);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function galaxyList(
	group: string
): Result<schema.galaxyList_resT> {
	const root = util.getGalaxyGroupDir(group);

	const result = await dir.list(root);
	if (result instanceof Error) return notok(result);

	return ok({ galaxies: result });
}

//
//
// Star
export async function starAdd(
	galaxyGroup: string,
	galaxy: string,
	name: string
): Result<schema.starAdd_resT> {
	const root = util.getGalaxyDir(galaxyGroup, galaxy);

	const result = await dir.add(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function starRemove(
	galaxyGroup: string,
	galaxy: string,
	name: string
): Result<schema.starRemove_resT> {
	const root = util.getGalaxyDir(galaxyGroup, galaxy);

	const result = await dir.remove(root, name);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function starRename(
	galaxyGroup: string,
	galaxy: string,
	oldName: string,
	newName: string
): Result<schema.starRename_resT> {
	const root = util.getGalaxyDir(galaxyGroup, galaxy);

	const result = await dir.rename(root, oldName, newName);
	if (result instanceof Error) return notok(result);

	return ok({});
}
export async function starList(
	galaxyGroup: string,
	galaxy: string
): Result<schema.starList_resT> {
	const root = util.getGalaxyDir(galaxyGroup, galaxy);

	const result = await dir.list(root);
	if (result instanceof Error) return notok(result);

	return ok({ stars: result });
}
