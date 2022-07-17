# shellcheck shell=bash

task.dev() {
	deno run --allow-net --allow-env --allow-write --allow-read --import-map ./import_map.json ./src/server.ts
}
