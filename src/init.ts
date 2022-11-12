import * as util from "./v2/util.ts";

export async function init() {
	const dir = await util.getDefaultDir();
	await Deno.mkdir(dir, { recursive: true });
}
