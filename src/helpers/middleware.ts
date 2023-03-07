import { Context, Status, send, path } from "@src/mod.ts";

import * as util from "@src/util/util.ts";
import { JSONError } from "@src/util/util.ts";

type Next = () => Promise<unknown>;

export async function handleErrors({ response }: Context, next: Next) {
	try {
		await next();
	} catch (err: unknown) {
		console.log(err);

		response.status = Status.InternalServerError;
		response.headers.set("Content-Type", "application/json");

		let bodyError;
		if (err instanceof JSONError) {
			bodyError = err.obj;
		} else if (err instanceof Error) {
			bodyError = err.message;
		} else {
			bodyError = err;
		}

		response.body = JSON.stringify(
			{
				error: bodyError,
			},
			null,
			"\t"
		);
	}
}

export async function handleLogs({ request: req }: Context, next: Next) {
	console.log(`${req.method} ${req.url.pathname}`);
	await next();
}

export async function handleAssets(ctx: Context, next: Next) {
	const pathname = ctx.request.url.pathname;

	if (pathname.startsWith("/assets")) {
		await send(ctx, pathname.slice("/assets".length), {
			root: util.get_public_dir(),
		});
	} else {
		await next();
	}
}

export async function handle404(ctx: Context) {
	await send(ctx, "index.html", {
		root: util.get_public_dir(),
	});
}
