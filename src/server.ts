import { Application, fs, send, path } from "./mod.ts";
import { router } from "./routes.ts";
import { config } from "./config.ts";

const app = new Application();
app.use(async ({ request: req }, next) => {
	console.log(`${req.method} ${req.url.pathname}`);
	await next();
});
app.use(async (ctx, next) => {
	const pathReq = ctx.request.url.pathname;
	if (pathReq.startsWith("/public")) {
		const pathFs = pathReq.slice("/public".length);
		if (await fs.exists(path.join(Deno.cwd(), "public"))) {
			await send(ctx, pathFs, {
				root: path.join(Deno.cwd(), "public"),
			});
			return;
		}
	}

	await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

const port = 15_800;
console.info(`Listening on port ${port}`);
await app.listen({ port });
