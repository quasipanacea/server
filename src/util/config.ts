import { z } from "zod";
import { path } from "@src/mod.ts";

const schema = z.object({
	documentsDir: z.string().min(1),
});

export const config = await getProcessedConfig();

async function getProcessedConfig(): Promise<z.infer<typeof schema>> {
	const config = await readConfig();

	if (config.documentsDir.at(0) === "~") {
		const home = Deno.env.get("HOME");
		if (!home) throw new Error("Could not read environment variable 'HOME'");

		config.documentsDir = path.join(home, config.documentsDir.slice(1));
	}

	return config;
}

async function readConfig(): Promise<z.infer<typeof schema>> {
	const configFile = getConfigFile();
	let config;
	try {
		const configText = await Deno.readTextFile(configFile);
		config = JSON.parse(configText);
	} catch (err: unknown) {
		if (err instanceof Deno.errors.NotFound) {
			config = {};
		} else {
			throw err;
		}
	}

	const result = await schema.safeParseAsync(config);
	if (!result.success) {
		console.error(result.error.flatten());
		throw new Error("Failed to validate schema");
	} else {
		return result.data;
	}
}

function getConfigFile() {
	let xdgConfigHome = Deno.env.get("XDG_CONFIG_HOME");
	if (!xdgConfigHome || xdgConfigHome[0] !== "/") {
		const home = Deno.env.get("HOME");
		if (!home) throw new Error("Could not read environment variable 'HOME'");

		xdgConfigHome = path.join(home, ".config");
	}

	return path.join(xdgConfigHome, "quazipanacea", "server.json");
}
