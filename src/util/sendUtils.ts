import { Context } from '../mod.ts'

export function error(ctx: Context, error: any) {
	ctx.response.status = 500
	ctx.response.headers.set('Content-Type', 'application/json')
	if (error?.error) {
		ctx.response.body = JSON.stringify(error.error, null, '\t')
	} else {
		ctx.response.body = JSON.stringify({ error }, null, '\t')
	}
}

export function json(ctx: Context, obj: Record<string, unknown>) {
	ctx.response.status = 200
	ctx.response.headers.set('Content-Type', 'application/json')
	ctx.response.body = JSON.stringify(obj, null, '\t')
}

export function success(ctx: Context) {
	ctx.response.status = 200
	ctx.response.headers.set('Content-Type', 'application/json')
	ctx.response.body = JSON.stringify({ success: true }, null, '\t')
}
