import { Router } from "@src/mod.ts";

export async function loadAllPluginParts(routesV2: Router, routesV3: Router) {
	for (const router of [routesV2, routesV3]) {
		await utilPlugin.loadPodRoutes(router);
	}
}
