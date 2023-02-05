import { Application, Router } from "@src/mod.ts";

import { init } from "@src/init.ts";
import * as utilPlugin from "@src/util/utilPlugin.ts";
import { router as routesV2 } from "@src/v2/routes.ts";
import { router as routesV3 } from "@src/v3/routes.ts";
import {
	handleErrors,
	handleLogs,
	handleStaticserve,
} from "@src/helpers/middleware.ts";

await init();

const app = new Application();
app.use(handleErrors);
app.use(handleLogs);
app.use(handleStaticserve);

const router = new Router();

await utilPlugin.loadAllPluginRoutes([routesV2, routesV3]);

router.use("/api/v2", routesV2.routes());
router.use("/api/v3", routesV3.routes());
app.use(router.routes());
app.use(router.allowedMethods());

const port = 15_800;
console.info(`Listening on port ${port}`);
await app.listen({ port });
