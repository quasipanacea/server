import { Context } from "../mod.ts";
import * as util from "./util.ts";
import * as schema from "../../../common/schemaV2.ts";

//
//
// Galaxy Group
export function galaxyGroupAdd(ctx: Context) {
	return util.unwrap<schema.galaxyGroupAdd_reqT>(
		ctx,
		schema.galaxyGroupAdd_req
	);
}

export function galaxyGroupRemove(ctx: Context) {
	return util.unwrap<schema.galaxyGroupRemove_reqT>(
		ctx,
		schema.galaxyGroupRemove_req
	);
}

export function galaxyGroupRename(ctx: Context) {
	return util.unwrap<schema.galaxyGroupRename_reqT>(
		ctx,
		schema.galaxyGroupRename_req
	);
}

export function galaxyGroupList(ctx: Context) {
	return util.unwrap<schema.galaxyGroupList_reqT>(
		ctx,
		schema.galaxyGroupList_req
	);
}

//
//
// Galaxy
export function galaxyAdd(ctx: Context) {
	return util.unwrap<schema.galaxyAdd_reqT>(ctx, schema.galaxyAdd_req);
}
export function galaxyRemove(ctx: Context) {
	return util.unwrap<schema.galaxyRemove_reqT>(ctx, schema.galaxyRemove_req);
}
export function galaxyRename(ctx: Context) {
	return util.unwrap<schema.galaxyRename_reqT>(ctx, schema.galaxyRename_req);
}
export function galaxyList(ctx: Context) {
	return util.unwrap<schema.galaxyList_reqT>(ctx, schema.galaxyList_req);
}

//
//
// Star
export function starAdd(ctx: Context) {
	return util.unwrap<schema.starAdd_reqT>(ctx, schema.starAdd_req);
}
export function starRemove(ctx: Context) {
	return util.unwrap<schema.starRemove_reqT>(ctx, schema.starRemove_req);
}
export function starRename(ctx: Context) {
	return util.unwrap<schema.starRename_reqT>(ctx, schema.starRename_req);
}
export function starList(ctx: Context) {
	return util.unwrap<schema.starList_reqT>(ctx, schema.starList_req);
}
