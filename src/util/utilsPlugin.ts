import { path, Router, toml, colors, z } from "@src/mod.ts";
import * as util from "@src/util/util.ts";
import {
	HooksModule,
	Endpoint,
	EndpointModule,
	SharedModule,
} from "@src/verify/types.ts";
import { SchemaPluginToml } from "@src/verify/schemas.ts";
import * as utilsSend from "@src/util/utilsSend.ts";
import * as utilsPod from "@src/util/utilsPod.ts";

function isPodPluginDirname(dirname: string) {
	return dirname.startsWith("pod-");
}

export async function getPodHooks(handler: string): Promise<HooksModule> {
	const hooksFile = path.join(
		util.getPluginsDir(),
		`Core/pod-${handler}/server-deno/hooks.ts`
	);

	try {
		const module = (await import(hooksFile)) as HooksModule;

		const onPodCreate = module.onPodCreate || (() => {});
		const onPodRemove = module.onPodRemove || (() => {});

		return {
			onPodCreate,
			onPodRemove,
		};
	} catch {
		throw new Error(`Failed to import hooks for plugin: ${handler}`);
	}
}

export async function loadPodRoutes(router: Router) {
	const coreDir = path.join(util.getPluginsDir(), "Core");
	for await (const podDir of await Deno.readDir(coreDir)) {
		if (!isPodPluginDirname(podDir.name)) continue;

		console.info(`${colors.bold("Loading:")} ${podDir.name}`);

		const pluginToml = await util.getPluginsToml(podDir.name);

		const endpointModule = (await import(
			path.join(coreDir, podDir.name, "server-deno/endpoints.ts")
		)) as EndpointModule;

		const sharedModule = (await import(
			path.join(coreDir, podDir.name, "server-deno/shared.ts")
		)) as SharedModule;

		const subrouter = new Router();
		subrouter.get("/", utilsSend.success);

		for (const exprt in endpointModule) {
			if (!Object.hasOwn(endpointModule, exprt)) continue;

			const endpoint = endpointModule[exprt];

			console.info(`/pod/plugin/${pluginToml.name}${endpoint.route}`);

			subrouter.post(endpoint.route, async (ctx) => {
				const data = await util.unwrap<{
					uuid?: string;
					[key: string]: unknown;
				}>(ctx, endpoint.schema.req);

				if (!data.uuid) {
					throw new Error("Request must have 'uuid'");
				}

				const pod = await utilsPod.getPod(data.uuid, pluginToml.name);
				const state = sharedModule.makeState(pod);

				const result = await endpoint.api(pod, state, data);
				return utilsSend.json(ctx, result);
			});

			router.use(`/pod/plugin/${pluginToml.name}`, subrouter.routes());
		}
	}
}

export async function getPluginList() {
	const plugins: { name: string; namePretty: string }[] = [];

	const coreDir = path.join(util.getPluginsDir(), "Core");
	for await (const file of await Deno.readDir(coreDir)) {
		if (!isPodPluginDirname(file.name)) continue;

		const pluginToml = await util.getPluginsToml(file.name);

		plugins.push({ name: pluginToml.name, namePretty: pluginToml.name });
	}

	return plugins;
}
