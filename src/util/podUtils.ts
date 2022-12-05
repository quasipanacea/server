import { path } from "../mod.ts";
import { Pod } from "./Pod.ts";
import * as util from "./util.ts";

export async function podMarkdownNewByUuid(uuid: string) {
	const dirpath = podFromUuid(uuid);

	const content = await Deno.readTextFile(path.join(dirpath, "metadata.json"));
	const name = JSON.parse(content).name;

	const pod = new Pod({ name, uuid });
	return pod;
}

export async function podMarkdownNewByName(name: string) {
	const uuid = crypto.randomUUID();

	const pod = new Pod({ name, uuid });
	await pod.construct(name);
	return pod;
}

export function podFromUuid(uuid: string) {
	return path.join(util.getPodDir(), uuid.slice(0, 2), uuid.slice(2));
}
