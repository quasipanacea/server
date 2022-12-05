export class JSONError extends Error {
	json: Record<string, unknown>;

	constructor(json: Record<string, unknown>) {
		super(`JSON Error: ${JSON.stringify(json, null, "\t")}`);
		this.name = this.constructor.name;
		this.json = json;
	}
}
