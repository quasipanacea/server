# shellcheck shell=bash

task.dev() {
	deno run --allow-net --allow-env --allow-write --allow-read ./src/server.ts
}