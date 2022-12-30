import * as util from "@src/util/util.ts";

export async function init() {
	const dir = await util.getDefaultDir();
	await Deno.mkdir(dir, { recursive: true });

	const dataDir = await util.getDataDir();
	await Deno.mkdir(dataDir, { recursive: true });

	const podMetafile = util.getPodMetafile();
	try {
		const f = await Deno.open(podMetafile, { createNew: true, write: true });
		f.write(new TextEncoder().encode("{}"));
		f.close();
	} catch (err: unknown) {
		if (!(err instanceof Deno.errors.AlreadyExists)) {
			throw err;
		}
	}
}
