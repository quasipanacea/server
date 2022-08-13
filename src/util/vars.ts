import { path } from "../mod.ts";

export const vars = {
	port: 3000,
	documentsDir: (() => {
		const home = Deno.env.get("HOME");
		if (!home) {
			throw new Error("Failed to get $HOME");
		}

		return path.join(home, "FoxDocumentsDir");
	})(),
};

await Deno.mkdir(vars.documentsDir, { recursive: true });
