import { Context, Status, send } from "@src/mod.ts";

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

export async function handleStaticserve(ctx: Context, next: Next) {
	const pathname = ctx.request.url.pathname;
	if (!pathname.startsWith("/public")) {
		await next();
		return;
	}

	await send(ctx, pathname.slice("/public".length), {
		root: "./public",
	});
}
