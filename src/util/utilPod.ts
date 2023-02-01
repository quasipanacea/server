import { path } from "@src/mod.ts";
import * as util from "@src/util/util.ts";
import { Pod } from "@src/verify/types.ts";

export function getPodDirFromUuid(uuid: string) {
	return path.join(util.getPodDir(), uuid.slice(0, 2), uuid.slice(2));
}

export async function getPod(uuid: string, handler?: string): Promise<Pod> {
	const dir = getPodDirFromUuid(uuid);
	const rootDir = path.dirname(dir);

	if (!handler) {
		const podsJson = await util.getPodsJson();
		handler = podsJson.pods[uuid].handler;
	}

	return {
		handler,
		uuid,
		dir,
		rootDir,
	};
}
