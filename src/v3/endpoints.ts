import { z } from "@src/mod.ts";

import * as util from "@src/util/util.ts";
import * as utilResource from "@src/util/utilResource.ts";
import * as utilPlugin from "@src/util/utilPlugin.ts";
import * as schemas from "@src/verify/schemas.ts";
import { InternalEndpoint } from "@src/verify/types.ts";

const uuid_t = z.string().min(1);
const name_t = z.string().min(1);
const handler_t = z.string().min(1);

// COLLECTIONS

export type addCollectionSchema_requestT = z.infer<
	(typeof addCollectionSchema)["req"]
>;
export type addCollectionSchema_responseT = z.infer<
	(typeof addCollectionSchema)["res"]
>;
export const addCollectionSchema = {
	req: z.object({ name: name_t, handler: z.string().min(1) }),
	res: z.object({ uuid: uuid_t }),
};
export const addCollection: InternalEndpoint<typeof addCollectionSchema> = {
	route: "/collection/add",
	schema: addCollectionSchema,
	async api(_ctx, data) {
		const uuid = crypto.randomUUID();
		const rDir = utilResource.getResourceDir("collections", uuid);
		const rJsonFile = await utilResource.getResourceJsonFile("collections");
		const rJson = await utilResource.getResourceJson<
			typeof schemas.ResourceSchemaCollections
		>("collections", schemas.ResourceSchemaCollections);

		// work
		rJson.collections[uuid] = {
			name: data.name,
			handler: data.handler,
		};
		await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		await Deno.mkdir(rDir, { recursive: true });

		// hook

		return {
			uuid,
		};
	},
};

export const removeCollectionSchema = {
	req: z.object({ uuid: uuid_t }),
	res: z.object({}),
};
export const removeCollection: InternalEndpoint<typeof removeCollectionSchema> =
	{
		route: "/collection/remove",
		schema: removeCollectionSchema,
		async api(_ctx, data) {
			const rDir = utilResource.getResourceDir("collections", data.uuid);
			const rJsonFile = await utilResource.getResourceJsonFile("collections");
			const rJson = await utilResource.getResourceJson<
				typeof schemas.ResourceSchemaCollections
			>("collections", schemas.ResourceSchemaCollections);

			// hook

			// work
			await Deno.remove(rDir, { recursive: true });
			if (rJson.collections[data.uuid]) {
				delete rJson.collections[data.uuid];
			}
			await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		},
	};

export const listCollectionSchema = {
	req: z.object({}),
	res: z.object({
		collections: z.array(
			z.object({
				uuid: uuid_t,
				name: name_t,
				handler: handler_t,
			})
		),
	}),
};
export const listCollection: InternalEndpoint<typeof listCollectionSchema> = {
	route: "/collection/list",
	schema: listCollectionSchema,
	async api(_ctx, _data) {
		const rJson = await utilResource.getResourceJson<
			typeof schemas.ResourceSchemaCollections
		>("collections", schemas.ResourceSchemaCollections);

		// work
		const collections: z.infer<
			(typeof listCollectionSchema)["res"]
		>["collections"] = [];
		for (const [uuid, obj] of Object.entries(rJson.collections)) {
			collections.push({
				uuid,
				name: obj.handler,
				handler: obj.handler,
			});
		}

		return { collections };
	},
};

// PODS

export const addPodSchema = {
	req: z.object({ name: name_t, handler: z.string().min(1) }),
	res: z.object({ uuid: uuid_t }),
};
export const addPod: InternalEndpoint<typeof addPodSchema> = {
	route: "/pod/add",
	schema: addPodSchema,
	async api(_ctx, data) {
		const uuid = crypto.randomUUID();
		const rDir = utilResource.getResourceDir("pods", uuid);
		const rJsonFile = await utilResource.getResourceJsonFile("pods");
		const rJson = await utilResource.getResourceJson<
			typeof schemas.ResourceSchemaPods
		>("pods", schemas.ResourceSchemaPods);

		// work
		rJson.pods[uuid] = {
			name: data.name,
			handler: data.handler,
		};
		await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
		await Deno.mkdir(rDir, { recursive: true });

		// hook

		return {
			uuid,
		};
	},
};

export const removePodSchema = {
	req: z.object({ uuid: uuid_t }),
	res: z.object({}),
};
export const removePod: InternalEndpoint<typeof removePodSchema> = {
	route: "/pod/remove",
	schema: removePodSchema,
	async api(_ctx, data) {
		const rDir = utilResource.getResourceDir("pods", data.uuid);
		const rJsonFile = await utilResource.getResourceJsonFile("pods");
		const rJson = await utilResource.getResourceJson<
			typeof schemas.ResourceSchemaPods
		>("pods", schemas.ResourceSchemaPods);

		// hook

		// work
		await Deno.remove(rDir, { recursive: true });
		if (rJson.pods[data.uuid]) {
			delete rJson.pods[data.uuid];
		}
		await Deno.writeTextFile(rJsonFile, util.jsonStringify(rJson));
	},
};

export const listPodSchema = {
	req: z.object({}),
	res: z.object({
		pods: z.array(
			z.object({
				uuid: uuid_t,
				name: name_t,
				handler: handler_t,
			})
		),
	}),
};
export const listPod: InternalEndpoint<typeof listPodSchema> = {
	route: "/pod/list",
	schema: listPodSchema,
	async api(_ctx, _data) {
		const rJson = await utilResource.getResourceJson<
			typeof schemas.ResourceSchemaPods
		>("pods", schemas.ResourceSchemaPods);

		const pods: z.infer<(typeof listPodSchema)["res"]>["pods"] = [];
		for (const [uuid, obj] of Object.entries(rJson.pods)) {
			pods.push({
				uuid,
				name: obj.handler,
				handler: obj.handler,
			});
		}

		return { pods };
	},
};

// PLUGINS

export type listPluginsSchema_requestT = z.infer<
	(typeof listPluginsSchema)["req"]
>;
export type listPluginsSchema_responseT = z.infer<
	(typeof listPluginsSchema)["res"]
>;
export const listPluginsSchema = {
	req: z.object({}),
	res: z.object({
		plugins: z.array(
			z.object({
				name: name_t,
				namePretty: z.string().min(1),
				resource: z.string().min(1),
				dir: z.string().min(1),
				fromPack: z.string().min(1),
			})
		),
	}),
};
export const listPlugins: InternalEndpoint<typeof listPluginsSchema> = {
	route: "/plugin/list",
	schema: listPluginsSchema,
	async api(_ctx, _data) {
		const plugins = await utilPlugin.getPluginList();
		return { plugins };
	},
};
