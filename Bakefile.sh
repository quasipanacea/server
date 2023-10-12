# shellcheck shell=bash

# watch: -c -r
task.dev() {
	./node_modules/.bin/ts-node --transpileOnly ./server.ts
}

task.build() {
	mkdir -p './build'
	deno bundle './src/server.ts' -- './build/bundle.js'
}

task.release-nightly() {
	task.build

	rm -rf './output'
	mkdir -p './output'
	tar -cz --transform 's,^\.,output,' -f './output/build.tar.gz' './build/bundle.js'

	./common/scripts/publish.sh './output/build.tar.gz'
}
