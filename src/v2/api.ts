import { fs, path } from "../mod.ts";
import * as schema from "../../../common/schemaV2.ts";
import * as util from "../util/util.ts";
import * as podUtils from "../util/podUtils.ts";

//
//
// Pod
export async function podAdd(
	type: string,
	name: string
): Promise<schema.podAdd_resT> {
	const uuid = crypto.randomUUID();
	const dir = podUtils.podFromUuid(uuid);

	const metaFile = util.getPodMetafile();
	const metaJson = JSON.parse(await Deno.readTextFile(metaFile));

	if (!metaJson.pod) {
		metaJson.pod = {};
	}
	metaJson.pod[uuid] = {
		type,
		name,
		progress: "locked",
	};
	await Deno.writeTextFile(metaFile, JSON.stringify(metaJson, null, "\t"));

	await Deno.mkdir(dir, { recursive: true });

	metaJson.pod[uuid].progress = "done";
	await Deno.writeTextFile(metaFile, JSON.stringify(metaJson, null, "\t"));

	return {};
}
export async function podRemove(uuid: string): Promise<schema.podRemove_resT> {
	const dir = path.dirname(podUtils.podFromUuid(uuid));

	const metaFile = util.getPodMetafile();
	const metaJson = JSON.parse(await Deno.readTextFile(metaFile));
	if (!metaJson.pod) {
		metaJson.pod = {};
	}
	if (metaJson.pod[uuid]) {
		metaJson.pod[uuid].progress = "locked";
	}
	await Deno.writeTextFile(metaFile, JSON.stringify(metaJson, null, "\t"));

	await Deno.remove(dir, { recursive: true });

	if (metaJson.pod[uuid]) {
		delete metaJson.pod[uuid];
	}
	await Deno.writeTextFile(metaFile, JSON.stringify(metaJson, null, "\t"));

	return {};
}
export async function podList(): Promise<schema.podList_resT> {
	const metafile = util.getPodMetafile();
	const data = JSON.parse(await Deno.readTextFile(metafile));

	const arr: { uuid: string; type: "markdown" | "plaintext"; name: string }[] =
		[];
	for (const [uuid, obj] of Object.entries(data.pod)) {
		arr.push({
			uuid,
			type: obj.type,
			name: obj.name,
		});
	}

	return { pods: arr };
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

	const f = await Deno.open(filename, { createNew: true, create: true });
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
