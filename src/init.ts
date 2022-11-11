import * as util from "./v2/util.ts";

export async function init() {
	const dir = await util.getGalaxyClusterDir();
	await Deno.mkdir(dir, { recursive: true });
}
