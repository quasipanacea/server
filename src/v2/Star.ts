export class Star {
	#galaxyDir;

	constructor(galaxyDir: string) {
		this.#galaxyDir = galaxyDir;
	}

	getGalaxyDir() {
		return this.#galaxyDir;
	}
}
