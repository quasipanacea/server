import { Router } from "../mod.ts";
import * as api from "../util/serverApi.ts";
import * as send from "../util/send.ts";
import * as extract from "../util/extract.ts";
import * as util from "../util/util.ts";

export const router = new Router();

// GROUP
router.post("/group/list", async (ctx) => {
	const data = await extract.groupList(ctx);
	if (!data) return;

	const result = await api.groupList();
	if (!result.success) {
		return send.error(ctx, result.data);
	}

	return send.json(ctx, {
		groups: result.data,
	});
});

router.post("/group/create", async (ctx) => {
	const data = await extract.groupCreate(ctx);
	if (!data) return;

	const result = await api.groupCreate(data.name);
	if (!result.success) {
		return send.error(ctx, result.data);
	}

	return send.success(ctx);
});

router.post("/group/delete", async (ctx) => {
	const data = await extract.groupDelete(ctx);
	if (!data) return;

	const result = await api.groupDelete(data.name);
	if (!result.success) {
		return send.error(ctx, result.data);
	}

	return send.success(ctx);
});

router.post("/group/rename", async (ctx) => {
	const data = await extract.groupRename(ctx);
	if (!data) return;

	const result = await api.groupRename(data.oldName, data.newName);
	if (!result.success) {
		return send.error(ctx, result.data);
	}

	return send.success(ctx);
});

/* ---------------------- document ---------------------- */

router.post("/document/create", async (ctx) => {
	await util.onKind(ctx, {
		single: async () => {
			const data = await extract.documentCreateSingle(ctx);
			if (!data) return;

			const result = await api.documentCreateSingle(data.name);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.success(ctx);
		},
		couple: async () => {
			const data = await extract.documentCreateCoupled(ctx);
			if (!data) return;

			const result = await api.documentCreateCouple(data.channel, data.id);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.success(ctx);
		},
	});
});

router.post("/document/read", async (ctx) => {
	await util.onKind(ctx, {
		single: async () => {
			const data = await extract.documentReadSingle(ctx);
			if (!data) return;

			const result = await api.documentReadSingle(data.name);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.json(ctx, {
				content: result.data,
			});
		},
		couple: async () => {
			const data = await extract.documentReadCouple(ctx);
			if (!data) return;

			const result = await api.documentReadCouple(data.channel, data.id);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.json(ctx, {
				content: result.data,
			});
		},
	});
});

router.post("/document/write", async (ctx) => {
	await util.onKind(ctx, {
		single: async () => {
			const data = await extract.documentWriteSingle(ctx);
			if (!data) return;

			const result = await api.documentWriteSingle(data.name, data.content);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.success(ctx);
		},
		couple: async () => {
			const data = await extract.documentWriteCouple(ctx);
			if (!data) return;

			const result = await api.documentWriteCouple(
				data.channel,
				data.id,
				data.content
			);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.success(ctx);
		},
	});
});

router.post("/document/rename", async (ctx) => {
	await util.onKind(ctx, {
		single: async () => {
			const data = await extract.documentRenameSingle(ctx);
			if (!data) return;

			const result = await api.documentRenameSingle(data.oldName, data.newName);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.success(ctx);
		},
		couple: async () => {
			const data = await extract.documentRenameCouple(ctx);
			if (!data) return;

			const result = await api.documentRenameCouple(
				data.channel,
				data.oldId,
				data.newId
			);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.success(ctx);
		},
	});
});

router.post("/document/delete", async (ctx) => {
	await util.onKind(ctx, {
		single: async () => {
			const data = await extract.documentDeleteSingle(ctx);
			if (!data) return;

			const result = await api.documentDeleteSingle(data.name);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.success(ctx);
		},
		couple: async () => {
			const data = await extract.documentDeleteCouple(ctx);
			if (!data) return;

			const result = await api.documentDeleteCouple(data.channel, data.id);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.success(ctx);
		},
	});
});

router.post("/document/list", async (ctx) => {
	await util.onKind(ctx, {
		single: async () => {
			const data = await extract.documentListSingle(ctx);
			if (!data) return;

			const result = await api.documentListSingle();
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.json(ctx, {
				documents: result.data,
			});
		},
		couple: async () => {
			const data = await extract.documentListCouple(ctx);
			if (!data) return;

			const result = await api.documentListCouple(data.channel);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.json(ctx, {
				documents: result.data,
			});
		},
	});
});

router.post("/document/query", async (ctx) => {
	await util.onKind(ctx, {
		single: async () => {
			const data = await extract.documentQuerySingle(ctx);
			if (!data) return;

			const result = await api.documentQuerySingle(data.name, data.query);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.json(ctx, {
				value: result.data,
			});
		},
		couple: async () => {
			const data = await extract.documentQueryCouple(ctx);
			if (!data) return;

			const result = await api.documentQueryCouple(
				data.channel,
				data.id,
				data.query
			);
			if (!result.success) {
				return send.error(ctx, result.data);
			}

			return send.json(ctx, {
				value: result.data,
			});
		},
	});
});
