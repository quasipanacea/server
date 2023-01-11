import { path, Context, z, toml } from "@src/mod.ts";
import { config } from "@src/util/config.ts";
import { SchemaPluginToml, SchemaPodsJson } from "../verify/schemas.ts";

export function jsonStringify(obj: Record<string, unknown>) {
	return JSON.stringify(obj, null, "\t");
}

export function tomlStringify(obj: Record<string, unknown>) {
	return toml.stringify(obj);
}

// misc
export function getPluginsDir() {
	return path.join(Deno.cwd(), "common/plugins");
}

export function getDataDir() {
	return path.join(config.documentsDir, "data");
}

export function getPodDir() {
	return path.join(getDataDir(), "pods");
}

export function getPodsJsonFile() {
	return path.join(getDataDir(), "pods.json");
}

export async function getPodsJson() {
	const file = getPodsJsonFile();
	const text = await Deno.readTextFile(file);

	return validateSchema<typeof SchemaPodsJson>(
		JSON.parse(text),
		SchemaPodsJson
	);
}

export async function getPluginsToml(pluginName: string) {
	return validateSchema<typeof SchemaPluginToml>(
		toml.parse(
			await Deno.readTextFile(
				path.join(getPluginsDir(), "Core", pluginName, "plugin.toml")
			)
		),
		SchemaPluginToml
	);
}

// hier
export function getDefaultDir() {
	return path.join(config.documentsDir, "Default");
}

export function getAreaDir(areaName: string) {
	return path.join(getDefaultDir(), areaName);
}

export function getTopicDir(areaName: string, topicName: string) {
	return path.join(getDefaultDir(), areaName, topicName);
}

export function getNoteDir(
	areaName: string,
	topicName: string,
	noteName: string
) {
	return path.join(getDefaultDir(), areaName, topicName, noteName);
}

export function getNoteFile(
	areaName: string,
	topicName: string,
	noteName: string
) {
	return path.join(getNoteDir(areaName, topicName, noteName), `${noteName}.md`);
}

export async function dirlist(dirpath: string): Promise<string[]> {
	const dirs = [];

	for await (const entry of Deno.readDir(dirpath)) {
		dirs.push(entry.name);
	}

	return dirs;
}

export async function unwrap<T>(
	ctx: Context,
	schema: z.AnyZodObject
): Promise<T> {
	const body = await ctx.request.body({ type: "text" }).value;
	const json = JSON.parse(body);
	validateSchema(json, schema);

	return json;
}

export function validateSchema<Schema extends z.AnyZodObject>(
	obj: Record<string, unknown>,
	schema: z.AnyZodObject
): z.infer<Schema> {
	const result = schema.strict().safeParse(obj);
	if (!result.success) {
		throw new JSONError(result.error.format());
	}
	return result.data;
}

export class JSONError extends Error {
	obj: Record<string, unknown>;

	constructor(
		obj: Record<string, unknown>,
		serializationType: "json" | "toml" = "json"
	) {
		let str = "???";
		switch (serializationType) {
			case "json":
				str = jsonStringify(obj);
				break;
			case "toml":
				str = tomlStringify(obj);
		}

		super(`JSON Error: ${str}`);

		this.name = this.constructor.name;
		this.obj = obj;
	}
}

export async function run_bg(args: string[]) {
	console.log(args);
	// TODO: security
	const p = Deno.run({
		// cmd: ["systemd-run", "--user", ...args],
		cmd: ["bash", "-c", `setsid ${args.join(" ")}`],
		stderr: "piped",
		stdout: "piped",
	});
	const [status, stdout, stderr] = await Promise.all([
		p.status(),
		p.output(),
		p.stderrOutput(),
	]);
	console.log(
		new TextDecoder().decode(stdout),
		new TextDecoder().decode(stderr)
	);
	if (!status.success) {
		throw new Error("Failed to spawn background process:" + stdout + stderr);
	}
	p.close();
}
