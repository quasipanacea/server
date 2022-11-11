import { Context, z, path, fs } from "../mod.ts";
import * as send from "./send.ts";
import { UnknownError } from "../error.ts";
import { config } from "../config.ts";

export function getGalaxyClusterDir(dir = "Default") {
	return path.join(config.documentsDir, dir);
}
export function getGalaxyGroupDir(galaxyGroupName: string) {
	return path.join(getGalaxyClusterDir(), galaxyGroupName);
}

export function getGalaxyDir(galaxyGroupName: string, galaxyName: string) {
	return path.join(getGalaxyClusterDir(), galaxyGroupName, galaxyName);
}

export function getStarDir(
	galaxyGroupName: string,
	galaxyName: string,
	starName: string
) {
	return path.join(
		getGalaxyClusterDir(),
		galaxyGroupName,
		galaxyName,
		starName
	);
}

export function getStarFile(
	galaxyGroupName: string,
	galaxyName: string,
	starName: string
) {
	return path.join(
		getStarDir(galaxyGroupName, galaxyName, starName),
		`${starName}.md`
	);
}

export async function unwrap<T>(
	ctx: Context,
	schema: z.AnyZodObject
): Promise<T | null> {
	let body;
	try {
		body = await ctx.request.body({ type: "text" }).value;
	} catch (err: unknown) {
		if (!(err instanceof Error)) return sendUnknownError(ctx, err);
		return send.error(ctx, err);
	}

	let json;
	try {
		json = JSON.parse(body);
	} catch (err: unknown) {
		if (!(err instanceof Error)) return sendUnknownError(ctx, err);
		return send.error(ctx, err);
	}

	let result;
	try {
		result = schema.strict().safeParse(json);
	} catch (err: unknown) {
		if (!(err instanceof Error)) return sendUnknownError(ctx, err);
		return send.error(ctx, err);
	}

	if (!result.success) {
		return send.error(ctx, result.error.format());
	}

	return json;
}

export function sendUnknownError(ctx: Context, err: unknown) {
	send.error(ctx, new UnknownError(err));
	return null;
}
