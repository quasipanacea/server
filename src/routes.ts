import { path, z, Application, Router, Context } from "./mod.ts";
import { vars } from "./util/vars.ts";
import * as util from "./util/util.ts";
import * as documentUtils from "./util/documentUtils.ts";
import * as sendUtils from "./util/sendUtils.ts";
import * as schema from "../../schema/src/index.ts";

export const router = new Router();

router.post("/api/meta", (ctx) => {
	return sendUtils.json(ctx, vars);
});

/* ---------------------- document ---------------------- */

// documentCreate
router.post("/api/document/create", async (ctx) => {
	const data = await util.extractRequest<schema.documentCreateReqType>(
		ctx,
		schema.documentCreateReq
	);
	if (!data) return;

	const apiResult = await documentUtils.documentCreate(data.name);
	if (!apiResult.success) {
		return sendUtils.error(ctx, apiResult.data);
	}

	return sendUtils.success(ctx);
});

// documentRead
router.post("/api/document/read", async (ctx) => {
	const data = await util.extractRequest<schema.documentReadReqType>(
		ctx,
		schema.documentCreateReq
	);
	if (!data) return;

	const apiResult = await documentUtils.documentRead(data.name);
	if (!apiResult.success) {
		return sendUtils.error(ctx, apiResult.data);
	}

	return sendUtils.json(ctx, {
		content: apiResult.data,
	});
});

// documentWrite
router.post("/api/document/write", async (ctx) => {
	const data = await util.extractRequest<schema.documentWriteReqType>(
		ctx,
		schema.documentWriteReq
	);
	if (!data) return;

	const apiResult = await documentUtils.documentWrite(data.name, data.content);
	if (!apiResult.success) {
		return sendUtils.error(ctx, apiResult.data);
	}

	return sendUtils.success(ctx);
});

// documentList
router.post("/api/document/list", async (ctx) => {
	const data = await util.extractRequest<schema.documentListReqType>(
		ctx,
		schema.documentListReq
	);
	if (!data) return;

	const apiResult = await documentUtils.documentList();
	if (!apiResult.success) {
		return sendUtils.error(ctx, apiResult.data);
	}

	return sendUtils.json(ctx, {
		documents: apiResult.data,
	});
});

/* ------------------- uniqueDocument ------------------- */

router.post("/api/uniqueDocument/read", async (ctx) => {
	const data = await util.extractRequest<schema.uniqueDocumentReadReqType>(
		ctx,
		schema.uniqueDocumentReadReq
	);
	if (!data) return;

	const readResult = await documentUtils.uniqueDocumentRead(
		data.context,
		data.id
	);
});

router.post("/api/uniqueDocument/list", async (ctx) => {
	const data = await util.extractRequest<schema.uniqueDocumentListReqType>(
		ctx,
		schema.uniqueDocumentListReq
	);
	if (!data) return;

	const arr = await documentUtils.uniqueDocumentList(data.context);
	return sendUtils.json(ctx, {
		documents: arr,
	});
});
