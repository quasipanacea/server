# shellcheck shell=bash

# watch: -c -r
task.dev() {
	deno run --allow-run --allow-net --allow-env --allow-write --allow-read ./src/server.ts
}

task.build() {
	mkdir -p './build'
	deno bundle './src/serverOld.ts' -- './build/bundle.js'
}

task.release-nightly() {
	task.build

	rm -rf './output'
	mkdir -p './output'
	tar -cz --transform 's,^\.,output,' -f './output/build.tar.gz' './build/bundle.js'

	./common/scripts/publish.sh './output/build.tar.gz'
}
