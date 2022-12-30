import { Application, Context, send, Router, Status } from "@src/mod.ts";
import { init } from "@src/init.ts";
import { JSONError } from "@src/util/util.ts";
import { router as routesV2 } from "@src/v2/routes.ts";

const app = new Application();

app.use(async ({ response }: Context, next) => {
	try {
		await next();
	} catch (err: unknown) {
		console.log(err);

		response.status = Status.InternalServerError;
		response.headers.set("Content-Type", "application/json");

		let bodyError;
		if (err instanceof JSONError) {
			bodyError = err.json;
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
});

app.use(async ({ request: req }: Context, next) => {
	console.log(`${req.method} ${req.url.pathname}`);
	await next();
});

app.use(async (ctx: Context, next) => {
	const pathname = ctx.request.url.pathname;
	if (!pathname.startsWith("/public")) {
		await next();
		return;
	}

	await send(ctx, pathname.slice("/public".length), {
		root: "./public",
	});
});

const router = new Router();

router.use("/api/v2", routesV2.routes());

app.use(router.routes());
app.use(router.allowedMethods());

await init();

const port = 15_800;
console.info(`Listening on port ${port}`);
await app.listen({ port });
