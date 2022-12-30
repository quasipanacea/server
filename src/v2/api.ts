import { fs, path } from "@src/mod.ts";
import * as util from "@src/util/util.ts";
import * as podUtils from "@src/util/podUtils.ts";
import * as pluginUtils from "@src/util/pluginUtils.ts";

import * as schema from "@common/schemaV2.ts";

//
//
// Pod
export async function podAdd(
	wraps: string,
	name: string
): Promise<schema.podAdd_resT> {
	const uuid = crypto.randomUUID();
	const dir = podUtils.podFromUuid(uuid);

	const metafilePath = util.getPodMetafile();
	const metafileJson = JSON.parse(await Deno.readTextFile(metafilePath));

	await Deno.mkdir(dir, { recursive: true });

	const { onCreate } = pluginUtils.getPodHooks(dir, wraps);
	await onCreate(dir);

	if (!metafileJson.pods) {
		metafileJson.pods = {};
	}
	metafileJson.pods[uuid] = { wraps, name };
	await Deno.writeTextFile(
		metafilePath,
		JSON.stringify(metafileJson, null, "\t")
	);

	return {};
}

export async function podRemove(uuid: string): Promise<schema.podRemove_resT> {
	const dir = path.dirname(podUtils.podFromUuid(uuid));

	const metafilePath = util.getPodMetafile();
	const metafileJson = JSON.parse(await Deno.readTextFile(metafilePath));

	if (!metafileJson.pods) {
		metafileJson.pods = {};
	}
	const wraps = metafileJson.pods[uuid].wraps;
	if (!wraps) {
		throw new Error("should not be undefined or empty");
	}

	const { onRemove } = pluginUtils.getPodHooks(dir, wraps);
	await onRemove(dir);
	await Deno.remove(dir, { recursive: true });

	if (metafileJson.pods[uuid]) {
		delete metafileJson.pods[uuid];
	}
	await Deno.writeTextFile(
		metafilePath,
		JSON.stringify(metafileJson, null, "\t")
	);

	return {};
}

export async function podList(wraps: string): Promise<schema.podList_resT> {
	const metafile = util.getPodMetafile();
	const data = JSON.parse(await Deno.readTextFile(metafile));

	const pods: schema.podList_resT["pods"] = [];
	for (const [uuid, obj] of Object.entries(data.pods)) {
		if (obj.wraps == wraps) {
			pods.push({
				uuid,
				wraps: obj.wraps,
				name: obj.name,
			});
		}
	}

	return { pods };
}

export async function podListPlugins(): Promise<schema.podListPlugins_resT> {
	const plugins: { name: string; wraps: string }[] = [];

	for await (const file of await Deno.readDir("./common/plugins/Core")) {
		if (file.name.startsWith("Pod")) {
			const index: { wraps: string } = await import(
				`../../common/plugins/Core/${file.name}/index.ts`
			);

			plugins.push({ name: file.name, wraps: index.wraps });
		}
	}

	return {
		plugins,
	};
}

export async function podQuery(uuid: string): Promise<schema.podQuery_resT> {
	const podsDatafile = util.getPodMetafile();
	const podsJson = JSON.parse(await Deno.readTextFile(podsDatafile));

	if (podsJson?.pods?.[uuid]) {
		return podsJson.pods[uuid];
	} else {
		return { wraps: "", name: "" };
	}
}

//
//
// Area
export async function areaAdd(name: string): Promise<schema.areaAdd_resT> {
	const dirname = util.getAreaDir(name);

	await Deno.mkdir(dirname, { recursive: true });

	return {};
}

export async function areaRemove(
	name: string
): Promise<schema.areaRemove_resT> {
	const dirname = util.getAreaDir(name);

	await Deno.remove(dirname, { recursive: true });

	return {};
}

export async function areaRename(
	oldName: string,
	newName: string
): Promise<schema.areaRename_resT> {
	const oldDirname = util.getAreaDir(oldName);
	const newDirname = util.getAreaDir(newName);

	await Deno.rename(oldDirname, newDirname);

	return {};
}

export async function areaList(): Promise<schema.areaList_resT> {
	const dirname = util.getDefaultDir();

	const result = await util.dirlist(dirname);

	return { areas: result };
}

//
//
// Topic
export async function topicAdd(
	area: string,
	name: string
): Promise<schema.topicAdd_resT> {
	const dirname = util.getTopicDir(area, name);

	await Deno.mkdir(dirname, { recursive: true });

	return {};
}

export async function topicRemove(
	area: string,
	name: string
): Promise<schema.topicRemove_resT> {
	const dirname = util.getTopicDir(area, name);

	await Deno.remove(dirname, { recursive: true });

	return {};
}

export async function topicRename(
	area: string,
	oldName: string,
	newName: string
): Promise<schema.topicRename_resT> {
	const oldDirname = util.getTopicDir(area, oldName);
	const newDirname = util.getTopicDir(area, newName);

	await Deno.rename(oldDirname, newDirname);

	return {};
}

export async function topicList(area: string): Promise<schema.topicList_resT> {
	const dirname = util.getAreaDir(area);

	const result = await util.dirlist(dirname);

	return { topics: result };
}

//
//
// note
export async function noteAdd(
	area: string,
	topic: string,
	name: string
): Promise<schema.noteAdd_resT> {
	const filename = util.getNoteFile(area, topic, name);

	await Deno.mkdir(path.dirname(filename), { recursive: true });
	const f = await Deno.open(filename, {
		createNew: true,
		write: true,
	});
	f.close();

	return {};
}

export async function noteRemove(
	area: string,
	topic: string,
	name: string
): Promise<schema.noteRemove_resT> {
	let filename = util.getNoteFile(area, topic, name);
	filename = path.dirname(filename);

	await Deno.remove(filename, { recursive: true });

	return {};
}

export async function noteRename(
	area: string,
	topic: string,
	oldName: string,
	newName: string
): Promise<schema.noteRename_resT> {
	const oldFilename = util.getNoteFile(area, topic, oldName);
	const newFilename = util.getNoteFile(area, topic, newName);

	await Deno.rename(oldFilename, newFilename);

	return {};
}

export async function noteRead(
	area: string,
	topic: string,
	name: string
): Promise<schema.noteRead_resT> {
	const filename = util.getNoteFile(area, topic, name);

	const result = await Deno.readTextFile(filename);

	return { content: result };
}

export async function noteWrite(
	area: string,
	topic: string,
	name: string,
	content: string
): Promise<schema.noteWrite_resT> {
	const filename = util.getNoteFile(area, topic, name);

	await Deno.writeTextFile(filename, content);

	return {};
}

export async function noteQuery(
	area: string,
	topic: string,
	query: string
): Promise<schema.noteQuery_resT> {
	const root = util.getTopicDir(area, topic);

	let result = "";
	switch (query) {
		case "does-exist": {
			const exists = await fs.exists(root);
			result = exists ? "yes" : "no";
		}
	}

	return { result };
}

export async function noteList(
	area: string,
	topic: string
): Promise<schema.noteList_resT> {
	const root = util.getTopicDir(area, topic);

	const result = await util.dirlist(root);

	return { notes: result };
}
