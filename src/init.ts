import { path, fs, Router, Status } from '@server/mod.ts'

import * as util from '@quasipanacea/common/server/util.ts'
import * as utilResource from '@quasipanacea/common/server/utilResource.ts'
import { trpc } from '@quasipanacea/common/server/trpc.ts'
import { coreRouter } from '@quasipanacea/common/routes.ts'
export { createContext } from '@quasipanacea/common/server/trpc.ts'

import { podPlugins } from '@quasipanacea/pack-core/_server.ts'

export async function init() {
	const dataDir = util.getDataDir()
	await Deno.mkdir(dataDir, { recursive: true })
	// Ensure a one to one correspondence from pod.json to directory structure
	{
		const podsJsonFile = utilResource.getPodsJsonFile()
		const podsJson = await utilResource.getPodsJson()
		if (podsJson.pods) {
			for (const uuid in podsJson.pods) {
				const filepath = utilResource.getPodDir(uuid)
				try {
					await Deno.stat(filepath)
					if ((await dircount(Deno.readDir(filepath))).length == 0) {
						console.log(
							`in pods.json, and in FS, but empty, so removing everywhere: ${filepath}`,
						)
						delete podsJson.pods[uuid]
						await Deno.remove(filepath)
						await Deno.remove(path.dirname(filepath))
					}
				} catch (err) {
					if (err instanceof Deno.errors.NotFound) {
						delete podsJson.pods[uuid]
						console.log(
							`in pods.json, but not FS, so removing pods.json entry: ${filepath}`,
						)
					}
				}
			}
			await Deno.writeTextFile(
				podsJsonFile,
				JSON.stringify(podsJson, null, '\t'),
			)
		}
	}
	// Ensure a one to one correspondence from directory to pod.json
	{
		const podsJsonFile = utilResource.getPodsJsonFile()
		const podsJson = await utilResource.getPodsJson()
		const podDir = utilResource.getPodsDir()
		// TODO
		if (!(await fs.exists(podDir))) {
			return
		}
		for await (const dir of Deno.readDir(podDir)) {
			const firstTwo = dir.name
			for await (const rest of Deno.readDir(path.join(podDir, firstTwo))) {
				const finalpath = path.join(podDir, firstTwo, rest.name)
				const uuid = `${firstTwo}${rest.name}`
				if (!podsJson.pods[uuid]) {
					if ((await dircount(Deno.readDir(finalpath))).length == 0) {
						await Deno.remove(finalpath)
						await Deno.remove(path.dirname(finalpath))
					} else {
						console.log(`in FS, but not in pods.json: ${finalpath}`)
					}
				}
			}
		}
	}
}
async function dircount<T>(
	source: AsyncIterable<T> | Iterable<T>,
): Promise<T[]> {
	const arr = []
	for await (const entry of source) {
		arr.push(entry)
	}
	return arr
}

// trpc router
const getTrpcRouter = (pluginId: string): any => {
	for (const podPlugin of podPlugins) {
		if (podPlugin.metadata.id === pluginId) {
			return podPlugin.trpcRouter
		}
	}

	throw new Error(`Failed to find pod plugin that matches id ${pluginId}`)
}
export const appRouter = trpc.router({
	core: coreRouter,
	plugins: trpc.router({
		pods: trpc.router({
			markdown: getTrpcRouter('markdown'),
			plaintext: getTrpcRouter('plaintext'),
			latex: getTrpcRouter('latex'),
		}),
	}),
})
export type AppRouter = typeof appRouter

// api router
const getOakRouter = (pluginId: string) => {
	for (const podPlugin of podPlugins) {
		if (podPlugin.metadata.id === pluginId) {
			return podPlugin.oakRouter
		}
	}

	throw new Error(`Failed to find pod plugin that matches id ${pluginId}`)
}
export const apiRouter = new Router()
	.use(
		'/plugins',
		new Router()
			.use(
				'/pod',
				new Router()
					.use('/latex', getOakRouter('latex').routes())

					.get('/(.*)', (ctx) => {
						ctx.response.status = Status.NotFound
						ctx.response.body = 'Failed to find plugin route\n'
					})
					.routes(),
			)
			.get('/(.*)', (ctx) => {
				ctx.response.status = Status.NotFound
				ctx.response.body = 'Plugin not found\n'
			})
			.routes(),
	)
	.get('/(.*)', (ctx) => {
		ctx.response.status = Status.NotFound
		ctx.response.body = 'Failed to find API route\n'
	})
