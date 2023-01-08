import { Context } from "@src/mod.ts";

import * as util from "@src/util/util.ts";

import * as schema from "@common/schemaV2.ts";

//
//
// Pod
export function podAdd(ctx: Context) {
	return util.unwrap<schema.podAdd_reqT>(ctx, schema.podAdd_req);
}

export function podRemove(ctx: Context) {
	return util.unwrap<schema.podRemove_reqT>(ctx, schema.podRemove_req);
}

export function podList(ctx: Context) {
	return util.unwrap<schema.podList_reqT>(ctx, schema.podList_req);
}

export function podListPlugins(ctx: Context) {
	return util.unwrap<schema.podListPlugins_reqT>(
		ctx,
		schema.podListPlugins_req
	);
}

export function podQuery(ctx: Context) {
	return util.unwrap<schema.podQuery_reqT>(ctx, schema.podQuery_req);
}

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

export function noteRead(ctx: Context) {
	return util.unwrap<schema.noteRead_reqT>(ctx, schema.noteRead_req);
}

export function noteWrite(ctx: Context) {
	return util.unwrap<schema.noteWrite_reqT>(ctx, schema.noteWrite_req);
}

export function noteQuery(ctx: Context) {
	return util.unwrap<schema.noteQuery_reqT>(ctx, schema.noteQuery_req);
}

export function noteList(ctx: Context) {
	return util.unwrap<schema.noteList_reqT>(ctx, schema.noteList_req);
}
