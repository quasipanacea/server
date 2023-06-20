import { path, fs, Router, Status, ProcedureRouterRecord } from '@server/mod.ts'

import { coreRouter } from '@quasipanacea/common/index.ts'
import {
	plugin,
	util,
	utilResource,
	trpcServer,
} from '@quasipanacea/common/server/index.ts'

import { initAll } from '@quasipanacea/pack-core/_server.ts'

export async function validateSystem() {
	async function dircount<T>(
		source: AsyncIterable<T> | Iterable<T>,
	): Promise<T[]> {
		const arr = []
		for await (const entry of source) {
			arr.push(entry)
		}
		return arr
	}

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

export async function initializePlugins() {
	await initAll()
}

export function yieldTrpcRouter() {
	const podRoutes: ProcedureRouterRecord = {}
	for (const id of ['markdown', 'plaintext', 'latex']) {
		const router = plugin.get('pod', id).trpcRouter
		if (router) {
			podRoutes[id] = router
		}
	}

	const trpcRouter = trpcServer.instance.router({
		core: coreRouter,
		plugins: trpcServer.instance.router({
			pods: trpcServer.instance.router(podRoutes),
		}),
	})

	return trpcRouter
}

export function yieldOakRouter() {
	const latexRouter = plugin.get('pod', 'latex').oakRouter
	if (!latexRouter) {
		throw new Error('latexRouter not defined')
	}

	const apiRouter = new Router()
		.use(
			'/plugins',
			new Router()
				.use(
					'/pod',
					new Router()
						.use('/latex', latexRouter.routes())

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

	return apiRouter
}
