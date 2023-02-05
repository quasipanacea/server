import { z, Context } from "@src/mod.ts";

export type Pod = {
	handler: string;
	uuid: string;
	dir: string;
	rootDir: string;
};

export type Endpoint<
	State,
	Schema extends {
		req: z.AnyZodObject;
		res: z.AnyZodObject;
	}
> = {
	route: string;
	schema: {
		req: z.AnyZodObject;
		res: z.AnyZodObject;
	};
	api: (
		pod: Pod,
		state: State,
		req: z.infer<Schema["req"]>
	) => Promise<z.infer<Schema["res"]>> | z.infer<Schema["res"]>;
};

export type InternalEndpoint<
	Schema extends {
		req: z.AnyZodObject;
		res: z.AnyZodObject;
	}
> = {
	route: string;
	schema: {
		req: z.AnyZodObject;
		res: z.AnyZodObject;
	};
	api: (
		ctx: Context,
		data: z.infer<Schema["req"]>
	) => Promise<z.infer<Schema["res"]>> | z.infer<Schema["res"]>;
};

export type OnPodCreate = (pod: Pod) => void | Promise<void>;

export type OnPodRemove = (pod: Pod) => void | Promise<void>;

export type MakeState<T extends Record<string, unknown>> = (pod: Pod) => T;

export type PluginModule = {
	onPodCreate: OnPodCreate;
	onPodRemove: OnPodRemove;
	makeState: MakeState<Record<string, unknown>>;
	[key: `${string}Endpoint`]: Endpoint<
		unknown,
		{ req: z.AnyZodObject; res: z.AnyZodObject }
	>;
};
