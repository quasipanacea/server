import { Context, Status, send } from '@server/mod.ts'

import * as util from '@quazipanacea/common/util.ts'
import { JSONError } from '@quazipanacea/common/util2.ts'

type Next = () => Promise<unknown> // TODO

export async function handleErrors({ response }: Context, next: Next) {
	try {
		await next()
	} catch (err: unknown) {
		console.log(err)

		response.status = Status.InternalServerError
		response.headers.set('Content-Type', 'application/json')

		let bodyError
		if (err instanceof JSONError) {
			bodyError = err.obj
		} else if (err instanceof Error) {
			bodyError = err.message
		} else {
			bodyError = err
		}

		response.body = JSON.stringify(
			{
				error: bodyError,
			},
			null,
			'\t',
		)
	}
}

export async function handleLogs({ request: req }: Context, next: Next) {
	console.log(`${req.method} ${req.url.pathname}`)
	await next()
}

export async function handleAssets(ctx: Context, next: Next) {
	const pathname = ctx.request.url.pathname

	if (pathname.startsWith('/assets')) {
		await send(ctx, pathname, {
			root: util.getPublicDir(),
		})
	} else {
		await next()
	}
}

export async function handle404(ctx: Context) {
	await send(ctx, 'index.html', {
		root: util.getPublicDir(),
	})
}
