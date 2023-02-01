import { Router } from "@src/mod.ts";

import * as util from "@src/util/util.ts";
import * as utilSend from "@src/util/utilSend.ts";
import * as utilPlugin from "@src/util/utilPlugin.ts";
import * as unwrap from "@src/v2/unwrap.ts";
import * as api from "@src/v2/api.ts";
import { InternalEndpointModule } from "../verify/types.ts";

export const router = new Router();

await loadInternalEndpoints(router);

async function loadInternalEndpoints(router: Router) {
	const endpointModule = (await import(
		"./endpoints.ts"
	)) as InternalEndpointModule;

	for (const exprt in endpointModule) {
		if (!Object.hasOwn(endpointModule, exprt)) continue;
		if (exprt.endsWith("Schema")) continue;

		const endpoint = endpointModule[exprt];

		router.post(endpoint.route, async (ctx) => {
			const data = await util.unwrap<{
				[key: string]: unknown;
			}>(ctx, endpoint.schema.req);

			const result = await endpoint.api(ctx, data);
			return utilSend.json(ctx, result);
		});
	}
}
