import { Application, Context, send, Router } from "./mod.ts";

import { router as routesV2 } from "./v2/routes.ts";
import { init } from "./init.ts";

const app = new Application();

app.use(async ({ request: req }: Context, next) => {
	console.log(`${req.method} ${req.url.pathname}`);
	await next();
});

app.use(async (ctx: Context, next) => {
	const pathname = ctx.request.url.pathname;
	if (!pathname.startsWith("/public")) {
		return await next();
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
