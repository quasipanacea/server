import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import chalk from 'chalk'
import express, { Request, Response } from 'express'
import { StatusCodes as Status } from 'http-status-codes'
import { initTRPC, type ProcedureRouterRecord } from '@trpc/server'

import { coreRouter } from '@quasipanacea/common/routes.ts'
import {
	pluginServer,
	util,
	utilResource,
} from '@quasipanacea/common/server/index.ts'

import { initAll } from '@quasipanacea/plugin-pack-core/_server.ts'
import { instance } from '@quasipanacea/common/server/trpcServer'

export async function initializeSystem() {
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
	await fs.mkdir(dataDir, { recursive: true })
	// Ensure a one to one correspondence from pod.json to directory structure
	{
		const podsJsonFile = utilResource.getPodsJsonFile()
		const podsJson = await utilResource.getPodsJson()
		if (podsJson.pods) {
			for (const uuid in podsJson.pods) {
				const filepath = utilResource.getPodDir(uuid)
				try {
					await fs.stat(filepath)
					if ((await fs.readdir(filepath)).length === 0) {
						console.log(
							`in pods.json, and in FS, but empty, so removing everywhere: ${filepath}`,
						)
						delete podsJson.pods[uuid]

						await fs.rm(filepath)
						await fs.rmdir(path.dirname(filepath))
					}
				} catch (err) {
					if (
						err instanceof Error &&
						(err as NodeJS.ErrnoException).code === 'ENOENT'
					) {
						delete podsJson.pods[uuid]
						console.log(
							`in pods.json, but not FS, so removing pods.json entry: ${filepath}`,
						)
					}
				}
			}

			await fs.writeFile(podsJsonFile, JSON.stringify(podsJson, null, '\t'))
		}
	}
	// Ensure a one to one correspondence from directory to pod.json
	{
		const podsJson = await utilResource.getPodsJson()
		const podDir = utilResource.getPodsDir()

		try {
			// await Deno.stat(podDir)
			await fs.stat(podDir)
		} catch (err) {
			if (
				err instanceof Error &&
				(err as NodeJS.ErrnoException).code === 'ENOENT'
			) {
				return
			} else {
				throw err
			}
		}

		for (const dir of await fs.readdir(podDir, { withFileTypes: true })) {
			const firstTwo = dir.name
			for (const rest of await fs.readdir(path.join(podDir, firstTwo), {
				withFileTypes: true,
			})) {
				const finalpath = path.join(podDir, firstTwo, rest.name)
				const uuid = `${firstTwo}${rest.name}`
				if (!podsJson.pods[uuid]) {
					if ((await fs.readdir(finalpath)).length === 0) {
						await fs.rm(finalpath)
						if ((await fs.readdir(path.dirname(finalpath))).length === 1) {
							await fs.rm(path.dirname(finalpath))
						}
					} else {
						let allFilesEmpty = true
						for (const file of await fs.readdir(finalpath, {
							withFileTypes: true,
						})) {
							if (!file.isFile()) {
								allFilesEmpty = false
								continue
							}

							const content = await fs.readFile(
								path.join(finalpath, file.name),
								'utf-8',
							)
							if (content.length !== 0) {
								allFilesEmpty = false
								continue
							}
						}

						if (allFilesEmpty) {
							await fs.rm(finalpath, { recursive: true })
							if ((await fs.readdir(path.dirname(finalpath))).length === 1) {
								await fs.rm(path.dirname(finalpath))
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

export async function initializeIndex() {
	const plugins = pluginServer.list()
	console.log(plugins)

	const indexJson = await utilResource.getIndexJson()
	indexJson.defaultOverviewPlugin = []

	const indexJsonFile = utilResource.getIndexJsonFile()
	await fs.writeFile(indexJsonFile, util.jsonStringify(indexJson))
}

export async function initializePlugins() {
	await initAll()
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

		console.log(`${chalk.magenta('Loading tRPC routes...')}`)

		const plugins = pluginServer.list()
		for (const plugin of plugins) {
			if (plugin?.modelController?.trpcRouter) {
				procedures[plugin.metadata.id] = plugin.modelController.trpcRouter
				console.log(`${chalk.yellow('plugin')}: ${plugin.metadata.id}`)
			} else if (plugin?.podController?.trpcRouter) {
				procedures[plugin.metadata.id] = plugin.podController.trpcRouter
				console.log(`${chalk.yellow('plugin')}: ${plugin.metadata.id}`)
			}
		}

		return trpcInstance.router(procedures)
	}

	return trpcInstance.router({
		core: coreRouter,
		plugins: createPluginsRouter(),
	})
}

export function yieldOakRouter() {
	const handle404 = (req: Request, res: Response) => {
		res.status(Status.NOT_FOUND)
		res.send('Plugin not found')
	}

	const createPluginsRouter = () => {
		const router = express.Router({ caseSensitive: true })

		console.log(`${chalk.magenta('Loading Oak routes...')}`)
		for (const pluginType of pluginServer.getFamilies()) {
			const router1 = express.Router({ caseSensitive: true })

			for (const plugin of pluginServer.list()) {
				const pluginId = plugin.metadata.id
				if (plugin?.modelController?.oakRouter) {
					router1.use(`/${pluginId}`, plugin.modelController.oakRouter)
					console.log(`${chalk.yellow('plugin')}: ${pluginId}`)
				} else if (plugin?.podController?.oakRouter) {
					router1.use(`/${pluginId}`, plugin.podController.oakRouter)
					console.log(`${chalk.yellow('plugin')}: ${pluginId}`)
				}
			}

			// if (Array.from(router1.keys()).length > 0) {
			// 	router.use(`/${pluginType}`, router1.routes())
			// 	router.get('/(.*)', handle404)
			// }
		}

		return router
	}

	return express
		.Router({ caseSensitive: true })
		.use('/plugins', createPluginsRouter())
		.get('/(.*)', handle404)
}
