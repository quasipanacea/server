import { Router } from "../../../mod.ts";
import { generatePdf, openPdfInNativeApp } from "./controller.ts";
import * as send from "../../../util/send.ts";

const router = new Router();
export default router;

router.post("/generate-pdf", async (ctx) => {
	await generatePdf();

	send.success(ctx);
});

router.post("/open-pdf-in-native-app", async (ctx) => {
	await openPdfInNativeApp();

	send.success(ctx);
});
