import { Router } from "../../../mod.ts";
import { openTextfile } from "./controller.ts";
import * as send from "../../../util/sendUtils.ts";

const router = new Router();
export default router;

router.post("/open-textfile", async (ctx) => {
	await openTextfile();

	send.success(ctx);
});
