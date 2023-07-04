import * as colors from 'std/fmt/colors.ts'
import { Application, Router } from 'oak/mod.ts'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { trpcServer } from '@quasipanacea/common/server/index.ts'

import {
	validateSystem,
	initializePlugins,
	updateIndex,
	yieldTrpcRouter,
	yieldOakRouter,
} from './init.ts'
import {
	handleErrors,
	handleLogs,
	handleAssets,
	handle404,
} from './helpers/middleware.ts'

await validateSystem()
await initializePlugins()
await updateIndex()

const app = new Application()
const router = new Router()
const oakRouter = yieldOakRouter()
const trpcRouter = yieldTrpcRouter<trpcServer.Context>(trpcServer.instance)

router.use(handleErrors)
router.use(handleLogs)
router.use(handleAssets)
router.all('/trpc/(.*)', async (ctx) => {
	const res = await fetchRequestHandler({
		endpoint: '/trpc',
		req: new Request(ctx.request.url, {
			headers: ctx.request.headers,
			body:
				ctx.request.method !== 'GET' && ctx.request.method !== 'HEAD'
					? ctx.request.body({ type: 'stream' }).value
					: void 0,
			method: ctx.request.method,
		}),
		router: trpcRouter,
		createContext: trpcServer.createContext,
		onError({ error }) {
			console.error(error)
		},
	})

	ctx.response.status = res.status
	ctx.response.headers = res.headers
	ctx.response.body = res.body
})
router.use('/api', oakRouter.routes())
router.use('/api', oakRouter.allowedMethods())
router.get('/(.*)', handle404)

app.use(router.routes())
app.use(router.allowedMethods())
app.addEventListener('listen', (ev) => {
	console.info(`${colors.blue('Listening on')} http://localhost:${ev.port}`)
})
await app.listen({ port: 15_800 })
