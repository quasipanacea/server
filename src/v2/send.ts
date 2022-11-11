import { Context, Status, z } from "../mod.ts";

export function error(
	ctx: Context,
	error: Error | z.ZodFormattedError<unknown>
) {
	ctx.response.status = Status.InternalServerError;
	ctx.response.headers.set("Content-Type", "application/json");

	if (error instanceof Error) {
		ctx.response.body = JSON.stringify({ error: error.message }, null, "\t");
	} else {
		ctx.response.body = JSON.stringify({ error }, null, "\t");
	}

	return null;
}

export function json(ctx: Context, obj: Record<string, unknown>) {
	ctx.response.status = Status.OK;
	ctx.response.headers.set("Content-Type", "application/json");
	ctx.response.body = JSON.stringify(obj, null, "\t");

	return null;
}

export function success(ctx: Context) {
	ctx.response.status = Status.OK;
	ctx.response.headers.set("Content-Type", "application/json");
	ctx.response.body = JSON.stringify({ success: true }, null, "\t");

	return null;
}
