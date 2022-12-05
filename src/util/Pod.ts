import { path } from "../mod.ts";
import { podFromUuid } from "./podUtils.ts";

type FileSpec = {
	byteType: "text" | "binary";
	flowType: "input" | "intermediate" | "output";
	name: string;
};

export class Pod {
	#uuid: string;
	#dirpath: string;
	#file: {
		markdown: FileSpec;
		pdf: FileSpec;
	};

	constructor(obj: { name: string; uuid: string }) {
		this.#uuid = obj.uuid;
		this.#dirpath = podFromUuid(obj.uuid);
		this.#file = {
			markdown: {
				byteType: "text",
				flowType: "input",
				name: `${obj.name}.md`,
			},
			pdf: {
				byteType: "text",
				flowType: "output",
				name: `${obj.name}.pdf`,
			},
		};
	}

	async getFileContent(file: "markdown" | "pdf") {
		const filespec = this.#file[file];
		const filepath = path.join(this.#dirpath, filespec.name);

		let content: string;
		if (filespec.byteType === "binary") {
			const raw = await Deno.readFile(filepath);
			content = new TextDecoder().decode(raw);
		} else {
			content = await Deno.readTextFile(filepath);
		}

		return content;
	}

	async construct(name: string) {
		await Deno.mkdir(this.#dirpath, { recursive: true });

		const metadataFile = path.join(this.#dirpath, "metadata.json");
		try {
			const f = await Deno.open(metadataFile, { createNew: true });
			await f.write(new TextEncoder().encode("{}"));
		} catch (err: unknown) {
			if (!(err instanceof Deno.errors.AlreadyExists)) {
				throw err;
			}
		}

		const json = JSON.parse(await Deno.readTextFile(metadataFile));
		json.name = name;
		await Deno.readTextFile(JSON.stringify(json, null, "\t"));
	}
}
