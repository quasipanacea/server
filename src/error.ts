export class UnknownError extends Error {
	constructor(message: unknown) {
		super(`unknown error: ${message}`);
		this.name = this.constructor.name;
	}
}

export class DocumentAlreadyExistsError extends Error {
	constructor(documentPath: string) {
		super(`document already exists: ${documentPath}`);
		this.name = this.constructor.name;
	}
}

export class DocumentDoesNotExistError extends Error {
	constructor(documentPath: string) {
		super(`document does not exist: ${documentPath}`);
		this.name = this.constructor.name;
	}
}

export class JSONError extends Error {
	json: Record<string, unknown>;

	constructor(json: Record<string, unknown>) {
		super(`JSON Error: ${JSON.stringify(json, null, "\t")}`);
		this.name = this.constructor.name;
		this.json = json;
	}
}
