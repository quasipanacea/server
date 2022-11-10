import { Application, Context, Next, fs, send, path } from "./mod.ts";
import { router as routesV1 } from "./api/v1.ts";
import { router as routesV2 } from "./api/v2.ts";
import { config } from "./config.ts";

const app = new Application();

app.use(async ({ request: req }: Context, next) => {
	console.log(`${req.method} ${req.url.pathname}`);
	await next();
});
app.use(async (ctx: Context, next) => {
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

app.use("/api", routesV1.routes());
app.use("/api", routesV1.allowedMethods());
app.use("/api/v1", routesV1.routes());
app.use("/api/v1", routesV1.allowedMethods());
app.use("/api/v2", routesV2.routes());
app.use("/api/v2", routesV2.allowedMethods());

const port = 15_800;
console.info(`Listening on port ${port}`);
await app.listen({ port });
