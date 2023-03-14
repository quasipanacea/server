import { path } from "@src/mod.ts";

import * as util from "@src/util/util.ts";
import type * as t from "@common/types.ts";

export async function getHooks(
	pluginId: string
): Promise<t.Hooks<Record<string, unknown>>> {
	const pluginList = await getPluginList();

	const plugin = pluginList.find((item) => {
		return item.kind === "pod" && item.id === pluginId;
	});

	if (!plugin) {
		throw new Error(`Failed to find plugin: ${plugin}`);
	}

	const tsFile = path.join(
		plugin.dir,
		"pod" + pluginId[0].toUpperCase() + pluginId.slice(1) + ".ts"
	);
	const module = (await import(tsFile)) as t.PluginModule;

	return module.hooks;
}

export async function getPluginList(): Promise<t.Plugin_t[]> {
	const plugins: t.Plugin_t[] = [];

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
				(resourceEntry.name !== "groups" &&
					resourceEntry.name !== "overviews" &&
					resourceEntry.name !== "pods" &&
					resourceEntry.name !== "covers")
			) {
				continue;
			}

			for await (const pluginEntry of await Deno.readDir(resourceDir)) {
				const pluginDir = path.join(resourceDir, pluginEntry.name);
				if (!pluginEntry.isDirectory) {
					continue;
				}

				plugins.push({
					id: pluginEntry.name,
					kind: resourceEntry.name.slice(0, -1) as t.Plugin_t["kind"],
					dir: pluginDir,
				});
			}
		}
	}

	return plugins;
}
