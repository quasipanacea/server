import * as path from 'std/path/mod.ts'
import * as colors from 'std/fmt/colors.ts'
import { Router, Status, Context } from 'oak/mod.ts'
import { initTRPC, type ProcedureRouterRecord } from '@trpc/server'

import { coreRouter } from '@quasipanacea/common/routes.ts'
import {
	pluginServer,
	util,
	utilResource,
} from '@quasipanacea/common/server/index.ts'

import { initAll } from '@quasipanacea/plugin-pack-core/_server.ts'

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
		const podsJson = await utilResource.getPodsJson()
		const podDir = utilResource.getPodsDir()

		try {
			await Deno.stat(podDir)
		} catch (err) {
			if (err instanceof Deno.errors.NotFound) {
				return
			} else {
				throw err
			}
		}

		for await (const dir of Deno.readDir(podDir)) {
			const firstTwo = dir.name
			for await (const rest of Deno.readDir(path.join(podDir, firstTwo))) {
				const finalpath = path.join(podDir, firstTwo, rest.name)
				const uuid = `${firstTwo}${rest.name}`
				if (!podsJson.pods[uuid]) {
					if ((await dircount(Deno.readDir(finalpath))).length == 0) {
						await Deno.remove(finalpath)
						if ((await dircount(path.dirname(finalpath))).length == 1) {
							await Deno.remove(path.dirname(finalpath))
						}
					} else {
						let allFilesEmpty = true
						for await (const file of Deno.readDir(finalpath)) {
							if (!file.isFile) {
								allFilesEmpty = false
								continue
							}

							const content = await Deno.readTextFile(
								path.join(finalpath, file.name),
							)
							if (content.length !== 0) {
								allFilesEmpty = false
								continue
							}
						}

						if (allFilesEmpty) {
							await Deno.remove(finalpath, { recursive: true })
							if ((await dircount(path.dirname(finalpath))).length == 1) {
								await Deno.remove(path.dirname(finalpath))
							}
						} else {
							console.log(`in FS, but not in pods.json: ${finalpath}`)
						}
					}
				}
			}
		}
	}
}

export async function initializePlugins() {
	await initAll()
}

export async function updateIndex() {
	// Index pods
	{
		const allFormats: Record<string, string[]> = {}

		const podsJson = await utilResource.getPodsJson()
		for (const uuid in podsJson.pods) {
			const pod = podsJson.pods[uuid]

			if (!allFormats[pod.format]) {
				allFormats[pod.format] = []
			}
		}

		const plugins = pluginServer.list('pod')
		for (const plugin of plugins) {
			if (allFormats[plugin.metadata.forFormat]) {
				allFormats[plugin.metadata.forFormat].push(plugin.metadata.id)
			} else {
				allFormats[plugin.metadata.forFormat] = [plugin.metadata.id]
			}
		}

		const indexJson = await utilResource.getIndexJson()
		indexJson.formats = allFormats

		const indexJsonFile = utilResource.getIndexJsonFile()
		await Deno.writeTextFile(indexJsonFile, util.jsonStringify(indexJson))
	}
}

export function yieldTrpcRouter<
	// deno-lint-ignore ban-types
	U extends object = object,
	T extends ReturnType<
		ReturnType<typeof initTRPC.context<U>>['create']
	> = ReturnType<ReturnType<typeof initTRPC.context<U>>['create']>,
>(trpcInstance: T) {
	const createPluginsRouter = () => {
		const procedures: ProcedureRouterRecord = {}

		console.log(`${colors.magenta('Loading tRPC routes...')}`)
		for (const pluginType of pluginServer.getFamilies()) {
			const subprocedures: ProcedureRouterRecord = {}

			const plugins = pluginServer.list(pluginType)
			for (const plugin of plugins) {
				if (plugin.trpcRouter) {
					subprocedures[plugin.metadata.id] = plugin.trpcRouter
				}
				console.log(
					`${colors.yellow('plugin')}: ${pluginType}.${plugin.metadata.id}`,
				)
			}

			procedures[pluginType] = trpcInstance.router(subprocedures)
		}

		return trpcInstance.router(procedures)
	}

	return trpcInstance.router({
		core: coreRouter,
		plugins: createPluginsRouter(),
	})
}

export function yieldOakRouter() {
	const handle404 = (ctx: Context) => {
		ctx.response.status = Status.NotFound
		ctx.response.body = 'Plugin not found\n'
	}

	const createPluginsRouter = () => {
		const router = new Router()

		console.log(`${colors.magenta('Loading Oak routes...')}`)
		for (const pluginType of pluginServer.getFamilies()) {
			const router1 = new Router()

			for (const plugin of pluginServer.list(pluginType)) {
				const pluginId = plugin.metadata.id
				if (plugin.oakRouter) {
					router1.use(`/${pluginId}`, plugin.oakRouter.routes())
					console.log(`${colors.yellow('plugin')}: ${pluginType}/${pluginId}`)
				}
			}

			if (Array.from(router1.keys()).length > 0) {
				router.use(`/${pluginType}`, router1.routes())
				router.get('/(.*)', handle404)
			}
		}

		return router
	}

	return new Router()
		.use('/plugins', createPluginsRouter().routes())
		.get('/(.*)', handle404)
}
