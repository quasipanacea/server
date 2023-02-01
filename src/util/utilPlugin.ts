import { path, Router, toml, colors } from "@src/mod.ts";
import * as util from "@src/util/util.ts";
import {
	HooksModule,
	EndpointModule,
	SharedModule,
} from "@src/verify/types.ts";
import { SchemaPluginToml } from "@src/verify/schemas.ts";
import * as utilSend from "@src/util/utilSend.ts";
import * as utilPod from "@src/util/utilPod.ts";

export async function getPodHooks(handler: string): Promise<HooksModule> {
	let hooksFile = null;
	for (const plugin of await getPluginList()) {
		if (plugin.name == handler) {
			hooksFile = path.join(plugin.dir, "server-deno/hooks.ts");
		}
	}

	if (!hooksFile) {
		throw new Error(`Failed to find hooks file for handler: ${handler}`);
	}

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
	for (const plugin of await getPluginList()) {
		if (plugin.resource !== "pod") continue;

		console.info(`${colors.bold("Loading:")} ${plugin.name}`);

		const pluginToml = await getPluginsToml(plugin.dir);

		const endpointModule = (await import(
			path.join(plugin.dir, "server-deno/endpoints.ts")
		)) as EndpointModule;

		const sharedModule = (await import(
			path.join(plugin.dir, "server-deno/shared.ts")
		)) as SharedModule;

		const subrouter = new Router();
		subrouter.get("/", utilSend.success);

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

				const pod = await utilPod.getPod(data.uuid, pluginToml.name);
				const state = sharedModule.makeState(pod);

				const result = await endpoint.api(pod, state, data);
				return utilSend.json(ctx, result);
			});

			router.use(`/pod/plugin/${pluginToml.name}`, subrouter.routes());
		}
	}
}

type Plugin = {
	name: string;
	namePretty: string;
	resource: string;
	dir: string;
	fromPack: string;
};

export async function getPluginList(): Promise<Plugin[]> {
	const plugins: Plugin[] = [];

	const packsDir = path.join(util.getPacksDir());
	for await (const packEntry of await Deno.readDir(packsDir)) {
		const packDir = path.join(packsDir, packEntry.name);

		if (packEntry.isFile || packEntry.isSymlink) {
			console.warn(`Skipping: ${packDir}`);
			continue;
		}

		for await (const pluginEntry of await Deno.readDir(packDir)) {
			const pluginDir = path.join(packDir, pluginEntry.name);

			if (pluginEntry.isFile || pluginEntry.isSymlink) {
				console.warn(`Skipping: ${pluginDir}`);
				continue;
			}

			const pluginConf = await getPluginsToml(pluginDir);
			plugins.push({
				name: pluginConf.name,
				namePretty: pluginConf.namePretty,
				resource: pluginEntry.name.split("-")[0],
				dir: pluginDir,
				fromPack: packEntry.name,
			});
		}
	}

	return plugins;
}

export async function getPluginsToml(pluginDir: string) {
	return util.validateSchema<typeof SchemaPluginToml>(
		toml.parse(await Deno.readTextFile(path.join(pluginDir, "plugin.toml"))),
		SchemaPluginToml
	);
}
