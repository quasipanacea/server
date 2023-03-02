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

export async function handleStaticserve(ctx: Context, next: Next) {
	const pathname = ctx.request.url.pathname;
	if (!pathname.startsWith("/public")) {
		await next();
		return;
	}

	const public_dir = util.get_public_dir();
	console.log("static: ", ctx.request.url);
	await send(ctx, pathname.slice("/public".length), {
		root: public_dir,
	});
}

export async function handleStaticserve2(ctx: Context, next: Next) {
	const pathname = ctx.request.url.pathname;
	if (!pathname.startsWith("/assets")) {
		await next();
		return;
	}

	const public_dir = util.get_public_dir();
	console.log("assets: ", ctx.request.url);
	await send(ctx, pathname.slice("/assets".length), {
		root: path.join(public_dir, "assets"),
	});
}

export async function handleIndex(ctx: Context) {
	const public_dir = util.get_public_dir();

	console.log("index: " + ctx.request.url);
	await send(ctx, "index.html", {
		root: public_dir,
	});
}
