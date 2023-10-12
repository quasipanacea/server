import express, { type Request, type Response } from 'express'
import chalk from 'chalk'
import * as trpcExpress from '@trpc/server/adapters/express'

import { trpcServer } from '@quasipanacea/common/server/index.ts'

import {
	initializeSystem,
	initializePlugins,
	initializeIndex,
	yieldTrpcRouter,
	yieldOakRouter,
} from './init.ts'
import { handleErrors, handleLogs, handleAssets, handle404 } from './util/middleware.ts'

//
;(async () => {
	await initializeSystem()
	await initializePlugins()
	await initializeIndex()

	const app = express()
	const router = express.Router({ caseSensitive: true })

	{
		const trpcRouter = yieldTrpcRouter<trpcServer.Context>(trpcServer.instance)

		router.use(handleErrors)
		router.use(handleLogs)
		router.use(
			'/trpc',
			trpcExpress.createExpressMiddleware({
				router: trpcRouter,
				createContext: trpcServer.createContext,
			}),
		)
		// router.use('/api', oakRouter.routes())
		router.use(handleAssets)
		router.get('/(.*)', handle404)
	}

	app.use(router)

	const port = 15_800
	const server = app.listen(port)
	server.on('listening', () => {
		console.info(`${chalk.blue('Listening on')} http://localhost:${port}`)
	})
})()
