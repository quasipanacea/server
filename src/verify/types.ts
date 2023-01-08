import { z } from "@src/mod.ts";

// TYPES

export type Pod = {
	handler: string;
	uuid: string;
	dir: string;
	rootDir: string;
};

// INTERFACES

// endpoint.ts
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

export type EndpointModule = {
	[key: string]: Endpoint<
		unknown,
		{ req: z.AnyZodObject; res: z.AnyZodObject }
	>;
};

// hooks.ts
export type OnPodCreate = (pod: Pod) => void | Promise<void>;

export type OnPodRemove = (pod: Pod) => void | Promise<void>;

export type HooksModule = {
	onPodCreate: OnPodCreate;
	onPodRemove: OnPodRemove;
};

// shared.ts
export type MakeState<T extends Record<string, unknown>> = (pod: Pod) => void;

export type SharedModule = {
	makeState: MakeState<Record<string, unknown>>;
};
