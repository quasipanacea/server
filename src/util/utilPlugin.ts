import { path, Router, toml, colors } from "@src/mod.ts";
import * as util from "@src/util/util.ts";
import { PluginModule } from "@src/verify/types.ts";
import { SchemaPluginToml } from "@src/verify/schemas.ts";
import * as utilSend from "@src/util/utilSend.ts";

// export async function getPluginsToml(pluginDir: string) {
// 	return util.validateSchema<typeof SchemaPluginToml>(
// 		toml.parse(await Deno.readTextFile(path.join(pluginDir, "plugin.toml"))),
// 		SchemaPluginToml
// 	);
// }

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

export async function loadAllPluginRoutes(routers: Router[]) {
	for (const router of routers) {
		for (const plugin of await getPluginList()) {
			if (plugin.resource !== "pods") continue;

			console.info(`${colors.bold("Loading:")} ${plugin.name}`);

			const routeName = plugin.name;
			const routeNameCased =
				plugin.name[0].toUpperCase() + plugin.name.slice(1);

			let pluginModule;
			try {
				pluginModule = (await import(
					path.join(plugin.dir, `pod${routeNameCased}.ts`)
				)) as PluginModule;
			} catch {
				console.log(`Skipping: ${plugin.name}`);
				continue;
			}

			const makeState = pluginModule.makeState || (() => {});

			const subrouter = new Router();
			subrouter.get("/", utilSend.success);

			for (const exprt in pluginModule) {
				if (!Object.hasOwn(pluginModule, exprt)) continue;
				if (!exprt.endsWith("Endpoint")) continue;

				const endpoint = pluginModule[exprt as `${string}Endpoint`];

				console.info(`/pod/plugin/${routeName}/${endpoint.route}`);

				subrouter.post(endpoint.route, async (ctx) => {
					const data = await util.unwrap<{
						uuid?: string;
						[key: string]: unknown;
					}>(ctx, endpoint.schema.req);

					if (!data.uuid) {
						throw new Error("Request must have 'uuid'");
					}

					const pod = await util.getPod(data.uuid, "pods");
					const state = makeState(pod);

					const result = await endpoint.api(pod, state, data);
					return utilSend.json(ctx, result);
				});

				router.use(`/pod/plugin/${routeName}`, subrouter.routes());
			}
		}
	}
}

type Plugin = {
	name: string;
	dir: string;
	resource: string;
	pack: string;
};

export async function getPluginList(): Promise<Plugin[]> {
	const plugins: Plugin[] = [];

	const packsDir = path.join(util.getPacksDir());
	for await (const packEntry of await Deno.readDir(packsDir)) {
		const packDir = path.join(packsDir, packEntry.name);
		if (!packEntry.isDirectory) {
			continue;
		}

		for await (const resourceEntry of await Deno.readDir(packDir)) {
			const resourceDir = path.join(packDir, resourceEntry.name);
			if (
				!resourceEntry.isDirectory ||
				(resourceEntry.name !== "collections" &&
					resourceEntry.name !== "overviews" &&
					resourceEntry.name !== "pods")
			) {
				continue;
			}

			for await (const pluginEntry of await Deno.readDir(resourceDir)) {
				const pluginDir = path.join(resourceDir, pluginEntry.name);
				if (!pluginEntry.isDirectory) {
					continue;
				}

				for await (const partEntry of await Deno.readDir(pluginDir)) {
					const _partDir = path.join(pluginDir, partEntry.name);

					plugins.push({
						name: pluginEntry.name,
						resource: resourceEntry.name,
						dir: pluginDir,
						pack: packEntry.name,
					});
				}
			}
		}
	}

	return plugins;
}
