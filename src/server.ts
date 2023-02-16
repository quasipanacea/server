import { serve, fetchRequestHandler } from "@src/mod.ts";
import type { FetchCreateContextFnOptions } from "~trpc-server/adapters/fetch";

import { init } from "@src/init.ts";
import { createContext } from "@common/trpc.ts";
import { appRouter } from "@common/routes.ts";

await init();

function handler(request: Request) {
	return fetchRequestHandler({
		endpoint: "/trpc",
		req: request,
		router: appRouter,
		onError({ error, type, path, input, ctx, req }) {
			console.error("Error:", error);
		},
		createContext,
	});
}

await serve(handler, { port: 15_799 });
