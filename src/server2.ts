import { serve, fetchRequestHandler } from "@src/mod.ts";
import { createContext } from "@common/context.ts";
import { appRouter } from "@common/routes.ts";

function handler(request: Request) {
	return fetchRequestHandler({
		endpoint: "/trpc",
		req: request,
		router: appRouter,
		createContext,
	});
}

serve(handler, { port: 15_799 });
