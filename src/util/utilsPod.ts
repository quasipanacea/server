import { path } from "@src/mod.ts";
import * as util from "@src/util/util.ts";

export function podFromUuid(uuid: string) {
	return path.join(util.getPodDir(), uuid.slice(0, 2), uuid.slice(2));
}
