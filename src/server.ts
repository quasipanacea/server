import { Application, Router, fetchRequestHandler } from "@src/mod.ts";

import { init, createContext, appRouter, oakPluginsRouter } from "@src/init.ts";
import {
	handleErrors,
	handleLogs,
	handleAssets,
	handle404,
} from "@src/helpers/middleware.ts";

await init();

const app = new Application();
app.use(handleErrors);
app.use(handleLogs);
app.use(handleAssets);

const router = new Router();

// trpc
router.all("/trpc/:_", async (ctx) => {
	const res = await fetchRequestHandler({
		endpoint: "/trpc",
		req: new Request(ctx.request.url, {
			headers: ctx.request.headers,
			body:
				ctx.request.method !== "GET" && ctx.request.method !== "HEAD"
					? ctx.request.body({ type: "stream" }).value
					: void 0,
			method: ctx.request.method,
		}),
		router: appRouter,
		createContext,
		onError({ error, type, path, input, ctx, req }) {
			console.error(error);
		},
	});

	ctx.response.status = res.status;
	ctx.response.headers = res.headers;
	ctx.response.body = res.body;
});

router.use("/api/plugins", oakPluginsRouter.routes());

app.use(router.routes());
app.use(router.allowedMethods());
app.use(handle404);

const port = 15_800;
console.info(`Listening on http://localhost:${port}`);
await app.listen({ port });
