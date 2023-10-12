import express, { NextFunction, Request, Response } from 'express'
import { StatusCodes as Status } from 'http-status-codes'

import { util } from '@quasipanacea/common/server/index.ts'

export async function handleErrors(_req: Request, res: Response, next: NextFunction) {
	try {
		await next()
	} catch (err) {
		console.log(err)

		res.status(Status.INTERNAL_SERVER_ERROR)
		res.set('Content-Type', 'application/json')

		let bodyError
		if (err instanceof util.JSONError) {
			bodyError = err.obj
		} else if (err instanceof Error) {
			bodyError = err.message
		} else {
			bodyError = err
		}

		res.send(
			JSON.stringify(
				{
					error: bodyError,
				},
				null,
				'\t',
			),
		)
	}
}

export async function handleLogs(req: Request, res: Response, next: NextFunction) {
	const url = new URL(req.url, `http://${req.headers.host}`)
	console.log(`${req.method} ${url.pathname}`)
	await next()
}

export async function handleAssets(req: Request, res: Response, next: NextFunction) {
	const url = new URL(req.url, `http://${req.headers.host}`)

	if (url.pathname.startsWith('/assets')) {
		res.sendFile(url.pathname, {
			root: util.getPublicDir(),
		})
	} else {
		await next()
	}
}

export async function handle404(_req: Request, res: Response, next: NextFunction) {
	res.sendFile('index.html', {
		root: util.getPublicDir(),
	})
}
