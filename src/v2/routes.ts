import { Router } from "../mod.ts";
import * as api from "./api.ts";
import * as send from "./send.ts";
import * as unwrap from "./unwrap.ts";
import * as util from "./util.ts";

export const router = new Router();

//
//
// Galaxy Group
router.post("/galaxy-group/add", async (ctx) => {
	const data = await unwrap.galaxyGroupAdd(ctx);
	if (!data) return;

	const result = await api.galaxyGroupAdd(data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/galaxy-group/remove", async (ctx) => {
	const data = await unwrap.galaxyGroupRemove(ctx);
	if (!data) return;

	const result = await api.galaxyGroupRemove(data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/galaxy-group/rename", async (ctx) => {
	const data = await unwrap.galaxyGroupRename(ctx);
	if (!data) return;

	const result = await api.galaxyGroupRename(data.oldName, data.newName);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/galaxy-group/list", async (ctx) => {
	const data = await unwrap.galaxyGroupList(ctx);
	if (!data) return;

	const result = await api.galaxyGroupList();
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

//
//
// Galaxy
router.post("/galaxy/add", async (ctx) => {
	const data = await unwrap.galaxyAdd(ctx);
	if (!data) return;

	const result = await api.galaxyAdd(data.galaxyGroup, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/galaxy/remove", async (ctx) => {
	const data = await unwrap.galaxyRemove(ctx);
	if (!data) return;

	const result = await api.galaxyRemove(data.galaxyGroup, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/galaxy/rename", async (ctx) => {
	const data = await unwrap.galaxyRename(ctx);
	if (!data) return;

	const result = await api.galaxyRename(
		data.galaxyGroup,
		data.oldName,
		data.newName
	);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/galaxy/list", async (ctx) => {
	const data = await unwrap.galaxyList(ctx);
	if (!data) return;

	const result = await api.galaxyList(data.galaxyGroup);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

//
//
// Stars
router.post("/star/add", async (ctx) => {
	const data = await unwrap.starAdd(ctx);
	if (!data) return;

	const result = await api.starAdd(data.galaxyGroup, data.galaxy, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/star/remove", async (ctx) => {
	const data = await unwrap.starRemove(ctx);
	if (!data) return;

	const result = await api.starRemove(data.galaxyGroup, data.galaxy, data.name);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/star/rename", async (ctx) => {
	const data = await unwrap.starRename(ctx);
	if (!data) return;

	const result = await api.starRename(
		data.galaxyGroup,
		data.galaxy,
		data.oldName,
		data.newName
	);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});

router.post("/star/list", async (ctx) => {
	const data = await unwrap.starList(ctx);
	if (!data) return;

	const result = await api.starList(data.galaxyGroup, data.galaxy);
	if (!result.ok) return send.error(ctx, result.error);

	return send.json(ctx, result.data);
});
