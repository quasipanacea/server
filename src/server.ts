import { Application } from "./mod.ts";
import { router } from "./routes.ts";
import { config } from "./config.ts";

const app = new Application();
app.use(async ({ request: req }, next) => {
	console.log(`${req.method} ${req.url.pathname}`);
	await next();
});
app.use(router.routes());
app.use(router.allowedMethods());

const port = config.port || 3000;
console.info(`Listening on port ${port}`);
await app.listen({ port });
