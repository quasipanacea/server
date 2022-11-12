import { Context } from "../mod.ts";
import * as util from "./util.ts";
import * as schema from "../../../common/schemaV2.ts";

//
//
// Area
export function areaAdd(ctx: Context) {
	return util.unwrap<schema.areaAdd_reqT>(ctx, schema.areaAdd_req);
}

export function areaRemove(ctx: Context) {
	return util.unwrap<schema.areaRemove_reqT>(ctx, schema.areaRemove_req);
}

export function areaRename(ctx: Context) {
	return util.unwrap<schema.areaRename_reqT>(ctx, schema.areaRename_req);
}

export function areaList(ctx: Context) {
	return util.unwrap<schema.areaList_reqT>(ctx, schema.areaList_req);
}

//
//
// Topic
export function topicAdd(ctx: Context) {
	return util.unwrap<schema.topicAdd_reqT>(ctx, schema.topicAdd_req);
}

export function topicRemove(ctx: Context) {
	return util.unwrap<schema.topicRemove_reqT>(ctx, schema.topicRemove_req);
}

export function topicRename(ctx: Context) {
	return util.unwrap<schema.topicRename_reqT>(ctx, schema.topicRename_req);
}

export function topicList(ctx: Context) {
	return util.unwrap<schema.topicList_reqT>(ctx, schema.topicList_req);
}

//
//
// Note
export function noteAdd(ctx: Context) {
	return util.unwrap<schema.noteAdd_reqT>(ctx, schema.noteAdd_req);
}

export function noteRemove(ctx: Context) {
	return util.unwrap<schema.noteRemove_reqT>(ctx, schema.noteRemove_req);
}

export function noteRename(ctx: Context) {
	return util.unwrap<schema.noteRename_reqT>(ctx, schema.noteRename_req);
}

export function noteList(ctx: Context) {
	return util.unwrap<schema.noteList_reqT>(ctx, schema.noteList_req);
}
