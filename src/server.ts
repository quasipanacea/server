import { Application, Router, fetchRequestHandler } from "@src/mod.ts";

import { init } from "@src/init.ts";
import {
	handleErrors,
	handleLogs,
	handleAssets,
	handle404,
} from "@src/helpers/middleware.ts";
import { appRouter } from "@common/routes.ts";
import { createContext } from "@common/trpc.ts";

await init();

const app = new Application();
app.use(handleErrors);
app.use(handleLogs);
app.use(handleAssets);

const router = new Router();

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
	});

	ctx.response.status = res.status;
	ctx.response.headers = res.headers;
	ctx.response.body = res.body;
});
app.use(router.routes());
app.use(router.allowedMethods());

app.use(handle404);

const port = 15_800;
console.info(`Listening on http://localhost:${port}`);
await app.listen({ port });
