import { Application, Router, fetchRequestHandler } from "@src/mod.ts";

import { init } from "@src/init.ts";
import {
	handleErrors,
	handleLogs,
	handleStaticserve,
	handleStaticserve2,
	handleIndex,
} from "@src/helpers/middleware.ts";
import { appRouter } from "@common/routes.ts";
import { createContext } from "@common/trpc.ts";

await init();

const app = new Application();
app.use(handleErrors);
app.use(handleLogs);
app.use(handleStaticserve);
app.use(handleStaticserve2);

const router = new Router();

router.all("/trpc/:_", async (ctx) => {
	const res = await fetchRequestHandler({
		endpoint: "/trpc",
		req: new Request(ctx.request.url, {
			headers: ctx.request.headers,
			body:
				ctx.request.method !== "GET" && ctx.request.method !== "HEAD"
					? ctx.request.body({ type: "stream" }).value
					: undefined,
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

app.use(handleIndex);

const port = 15_800;
console.info(`Listening on http://localhost:${port}`);
await app.listen({ port });
