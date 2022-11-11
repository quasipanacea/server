import { Router } from "../mod.ts";
import * as internal from "../internal/v2.ts";
import * as send from "../util/send.ts";
import * as extract from "../util/extract.ts";
import * as util from "../util/util.ts";

export const router = new Router();

// router.post("/group/list", async (ctx) => {
// 	const data = await extract.groupList(ctx);
// 	if (!data) return;

// 	const result = await internal.groupList();
// 	if (!result.success) {
// 		return send.error(ctx, result.data);
// 	}

// 	return send.json(ctx, {
// 		groups: result.data,
// 	});
// });

// router.post("/group/create", async (ctx) => {
// 	const data = await extract.groupCreate(ctx);
// 	if (!data) return;

// 	const result = await internal.groupCreate(data.name);
// 	if (!result.success) {
// 		return send.error(ctx, result.data);
// 	}

// 	return send.success(ctx);
// });

// router.post("/group/delete", async (ctx) => {
// 	const data = await extract.groupDelete(ctx);
// 	if (!data) return;

// 	const result = await internal.groupDelete(data.name);
// 	if (!result.success) {
// 		return send.error(ctx, result.data);
// 	}

// 	return send.success(ctx);
// });

// router.post("/group/rename", async (ctx) => {
// 	const data = await extract.groupRename(ctx);
// 	if (!data) return;

// 	const result = await internal.groupRename(data.oldName, data.newName);
// 	if (!result.success) {
// 		return send.error(ctx, result.data);
// 	}

// 	return send.success(ctx);
// });

// router.post("/star/create", async (ctx) => {
// 	await util.onKind(ctx, {
// 		single: async () => {
// 			const data = await extract.documentCreateSingle(ctx);
// 			if (!data) return;

// 			const result = await internal.documentCreateSingle(data.name);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.success(ctx);
// 		},
// 		couple: async () => {
// 			const data = await extract.documentCreateCoupled(ctx);
// 			if (!data) return;

// 			const result = await internal.documentCreateCouple(data.channel, data.id);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.success(ctx);
// 		},
// 	});
// });

// router.post("/star/read", async (ctx) => {
// 	await util.onKind(ctx, {
// 		single: async () => {
// 			const data = await extract.documentReadSingle(ctx);
// 			if (!data) return;

// 			const result = await internal.documentReadSingle(data.name);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.json(ctx, {
// 				content: result.data,
// 			});
// 		},
// 		couple: async () => {
// 			const data = await extract.documentReadCouple(ctx);
// 			if (!data) return;

// 			const result = await internal.documentReadCouple(data.channel, data.id);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.json(ctx, {
// 				content: result.data,
// 			});
// 		},
// 	});
// });

// router.post("/star/write", async (ctx) => {
// 	await util.onKind(ctx, {
// 		single: async () => {
// 			const data = await extract.documentWriteSingle(ctx);
// 			if (!data) return;

// 			const result = await internal.documentWriteSingle(data.name, data.content);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.success(ctx);
// 		},
// 		couple: async () => {
// 			const data = await extract.documentWriteCouple(ctx);
// 			if (!data) return;

// 			const result = await internal.documentWriteCouple(
// 				data.channel,
// 				data.id,
// 				data.content
// 			);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.success(ctx);
// 		},
// 	});
// });

// router.post("/star/rename", async (ctx) => {
// 	await util.onKind(ctx, {
// 		single: async () => {
// 			const data = await extract.documentRenameSingle(ctx);
// 			if (!data) return;

// 			const result = await internal.documentRenameSingle(data.oldName, data.newName);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.success(ctx);
// 		},
// 		couple: async () => {
// 			const data = await extract.documentRenameCouple(ctx);
// 			if (!data) return;

// 			const result = await internal.documentRenameCouple(
// 				data.channel,
// 				data.oldId,
// 				data.newId
// 			);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.success(ctx);
// 		},
// 	});
// });

// router.post("/star/delete", async (ctx) => {
// 	await util.onKind(ctx, {
// 		single: async () => {
// 			const data = await extract.documentDeleteSingle(ctx);
// 			if (!data) return;

// 			const result = await internal.documentDeleteSingle(data.name);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.success(ctx);
// 		},
// 		couple: async () => {
// 			const data = await extract.documentDeleteCouple(ctx);
// 			if (!data) return;

// 			const result = await internal.documentDeleteCouple(data.channel, data.id);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.success(ctx);
// 		},
// 	});
// });

// router.post("/star/list", async (ctx) => {
// 	await util.onKind(ctx, {
// 		single: async () => {
// 			const data = await extract.documentListSingle(ctx);
// 			if (!data) return;

// 			const result = await internal.documentListSingle();
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.json(ctx, {
// 				documents: result.data,
// 			});
// 		},
// 		couple: async () => {
// 			const data = await extract.documentListCouple(ctx);
// 			if (!data) return;

// 			const result = await internal.documentListCouple(data.channel);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.json(ctx, {
// 				documents: result.data,
// 			});
// 		},
// 	});
// });

// router.post("/star/query", async (ctx) => {
// 	await util.onKind(ctx, {
// 		single: async () => {
// 			const data = await extract.documentQuerySingle(ctx);
// 			if (!data) return;

// 			const result = await internal.documentQuerySingle(data.name, data.query);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.json(ctx, {
// 				value: result.data,
// 			});
// 		},
// 		couple: async () => {
// 			const data = await extract.documentQueryCouple(ctx);
// 			if (!data) return;

// 			const result = await internal.documentQueryCouple(
// 				data.channel,
// 				data.id,
// 				data.query
// 			);
// 			if (!result.success) {
// 				return send.error(ctx, result.data);
// 			}

// 			return send.json(ctx, {
// 				value: result.data,
// 			});
// 		},
// 	});
// });
