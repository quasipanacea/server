import { serve } from "./mod.ts";
import { fetchRequestHandler } from "npm:@trpc/server/adapters/fetch";
import { createContext } from "../common/context.ts";
import { appRouter } from "../common/routes.ts";

function handler(request: Request) {
	return fetchRequestHandler({
		endpoint: "/trpc",
		req: request,
		router: appRouter,
		createContext,
	});
}

serve(handler, { port: 15_799 });
