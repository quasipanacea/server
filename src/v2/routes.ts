import { Router } from "../mod.ts";
import * as api from "./api.ts";
import * as send from "./send.ts";
import * as unwrap from "./unwrap.ts";
import * as util from "./util.ts";

export const router = new Router();

//
//
// Capsule
router.post("/capsule/add", async (ctx) => {});

router.post("/capsule/remove", async (ctx) => {});

router.post("/capsule/remove", async (ctx) => {});

router.post("/capsule/remove", async (ctx) => {});

//
//
// Area
router.post("/area/add", async (ctx) => {
	const data = await unwrap.areaAdd(ctx);
	if (!data) return;

	const result = await api.areaAdd(data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/area/remove", async (ctx) => {
	const data = await unwrap.areaRemove(ctx);
	if (!data) return;

	const result = await api.areaRemove(data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/area/rename", async (ctx) => {
	const data = await unwrap.areaRename(ctx);
	if (!data) return;

	const result = await api.areaRename(data.oldName, data.newName);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/area/list", async (ctx) => {
	const data = await unwrap.areaList(ctx);
	if (!data) return;

	const result = await api.areaList();
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

//
//
// Topic
router.post("/topic/add", async (ctx) => {
	const data = await unwrap.topicAdd(ctx);
	if (!data) return;

	const result = await api.topicAdd(data.area, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/topic/remove", async (ctx) => {
	const data = await unwrap.topicRemove(ctx);
	if (!data) return;

	const result = await api.topicRemove(data.area, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/topic/rename", async (ctx) => {
	const data = await unwrap.topicRename(ctx);
	if (!data) return;

	const result = await api.topicRename(data.area, data.oldName, data.newName);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/topic/list", async (ctx) => {
	const data = await unwrap.topicList(ctx);
	if (!data) return;

	const result = await api.topicList(data.area);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

//
//
// Note
router.post("/note/add", async (ctx) => {
	const data = await unwrap.noteAdd(ctx);
	if (!data) return;

	const result = await api.noteAdd(data.area, data.topic, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/note/remove", async (ctx) => {
	const data = await unwrap.noteRemove(ctx);
	if (!data) return;

	const result = await api.noteRemove(data.area, data.topic, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/note/rename", async (ctx) => {
	const data = await unwrap.noteRename(ctx);
	if (!data) return;

	const result = await api.noteRename(
		data.area,
		data.topic,
		data.oldName,
		data.newName
	);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/note/read", async (ctx) => {
	const data = await unwrap.noteRead(ctx);
	if (!data) return;

	const result = await api.noteRead(data.area, data.topic, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/note/write", async (ctx) => {
	const data = await unwrap.noteWrite(ctx);
	if (!data) return;

	const result = await api.noteWrite(
		data.area,
		data.topic,
		data.name,
		data.content
	);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/note/query", async (ctx) => {
	const data = await unwrap.noteQuery(ctx);
	if (!data) return;

	const result = await api.noteQuery(data.area, data.topic, data.query);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/note/list", async (ctx) => {
	const data = await unwrap.noteList(ctx);
	if (!data) return;

	const result = await api.noteList(data.area, data.topic);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});
