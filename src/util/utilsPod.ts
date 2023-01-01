import { path } from "@src/mod.ts";
import * as util from "@src/util/util.ts";

export function getPodDirFromUuid(uuid: string) {
	return path.join(util.getPodDir(), uuid.slice(0, 2), uuid.slice(2));
}
