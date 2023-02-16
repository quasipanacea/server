# shellcheck shell=bash

# watch: -c -r
task.dev() {
	deno run --allow-run --allow-net --allow-env --allow-write --allow-read ./src/server.ts
}

task.build() {
	mkdir -p './build'
	deno bundle './src/server.ts' -- './build/bundle.js'
}

task.release-nightly() {
	task.build
	tar czf './output/build.tar.gz' './build/bundle.js'

	util.publish './output/build.tar.gz'
}

util.publish() {
	local file="$1"
	bake.assert_not_empty 'file'

	local tag_name='nightly'
	git tag -fa "$tag_name" -m ''
	git push origin ":refs/tags/$tag_name"
	git push --tags
	gh release upload "$tag_name" "$file" --clobber
	gh release edit --draft=false nightly
}
