import { path, fs } from "./mod.ts";
import * as util from "@src/util/util.ts";
import * as utilResource from "@src/util/utilResource.ts";

import { ResourceSchemaPods } from "@src/verify/schemas.ts";

export async function init() {
	const defaultDir = await util.getDefaultDir();
	await Deno.mkdir(defaultDir, { recursive: true });

	const dataDir = await util.getDataDir();
	await Deno.mkdir(dataDir, { recursive: true });

	// Create symlinks so Vite can perform dynamic import
	{
		const packsDir = util.getPacksDir();
		const symlinksDir = path.join(packsDir, "../resource-symlinks");

		for await (const resourceEntry of await Deno.readDir(symlinksDir)) {
			const resourceDir = path.join(symlinksDir, resourceEntry.name);

			for await (const part of await Deno.readDir(resourceDir)) {
				const partFile = path.join(resourceDir, part.name);
				await Deno.remove(partFile);
			}
		}
		for await (const entry of fs.walk(packsDir)) {
			if (entry.name.startsWith("Overview") && entry.name.endsWith(".vue")) {
				const symlink = path.join(symlinksDir, "overviews", entry.name);
				await Deno.mkdir(path.dirname(symlink), { recursive: true });
				await Deno.symlink(entry.path, symlink);
			} else if (entry.name.startsWith("Pod") && entry.name.endsWith(".vue")) {
				const symlink = path.join(symlinksDir, "pods", entry.name);
				await Deno.mkdir(path.dirname(symlink), { recursive: true });
				await Deno.symlink(entry.path, symlink);
			}
		}
	}

	// Ensure a one to one correspondence from pod.json to directory structure
	{
		const podMetafile = util.getPodsJsonFile();
		const obj = util.validateSchema<typeof ResourceSchemaPods>(
			JSON.parse(await Deno.readTextFile(podMetafile)),
			ResourceSchemaPods
		);
		if (obj.pods) {
			for (const uuid in obj.pods) {
				if (!Object.hasOwn(obj.pods, uuid)) continue;

				const filepath = utilResource.getResourceDir("pods", uuid);
				try {
					await Deno.stat(filepath);

					if ((await all(await Deno.readDir(filepath))).length == 0) {
						console.log(
							`in pods.json, and in FS, but empty, so removing everywhere: ${filepath}`
						);
						delete obj.pods[uuid];
						await Deno.remove(filepath);
						await Deno.remove(path.dirname(filepath));
					}
				} catch (err) {
					if (err instanceof Deno.errors.NotFound) {
						delete obj.pods[uuid];
						console.log(
							`in pods.json, but not FS, so removing pods.json entry: ${filepath}`
						);
					}
				}
			}

			await Deno.writeTextFile(podMetafile, JSON.stringify(obj, null, "\t"));
		}
	}

	// Ensure a one to one correspondence from directory to pod.json
	{
		const podMetafile = util.getPodsJsonFile();
		const obj = util.validateSchema<typeof ResourceSchemaPods>(
			JSON.parse(await Deno.readTextFile(podMetafile)),
			ResourceSchemaPods
		);
		const podDir = util.getPodDir();
		for await (const dir of await Deno.readDir(podDir)) {
			const firstTwo = dir.name;

			for await (const rest of await Deno.readDir(
				path.join(podDir, firstTwo)
			)) {
				const finalpath = path.join(podDir, firstTwo, rest.name);
				const uuid = `${firstTwo}${rest.name}`;

				if (!obj.pods[uuid]) {
					if ((await all(await Deno.readDir(finalpath))).length == 0) {
						await Deno.remove(finalpath);
						await Deno.remove(path.dirname(finalpath));
					} else {
						console.log(`in FS, but not in pods.json: ${finalpath}`);
					}
				}
			}
		}
	}
}

async function all<T>(source: AsyncIterable<T> | Iterable<T>): Promise<T[]> {
	const arr = [];

	for await (const entry of source) {
		arr.push(entry);
	}

	return arr;
}
