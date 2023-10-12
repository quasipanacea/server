import { Request, Response } from 'express'
import { StatusCodes as Status } from 'http-status-codes'
import { z } from 'zod'

export function json(
	res: Response,
	obj: Record<string, unknown> | z.AnyZodObject,
) {
	res.status(Status.OK)
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify(obj, null, '\t'))

	return null
}

export function success(res: Response) {
	res.status(Status.OK)
	res.set('Content-Type', 'application/json')
	res.send(JSON.stringify({ success: true }, null, '\t'))

	return null
}
