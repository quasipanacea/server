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
