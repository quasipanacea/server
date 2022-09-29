import { Context } from "../mod.ts";
import * as util from "./util.ts";
import * as schema from "../../common/schema.ts";

export function documentCreateSingle(ctx: Context) {
	return util.extractRequest<schema.documentCreateSingleRequestType>(
		ctx,
		schema.documentCreateSingleRequest
	);
}

export function documentCreateCoupled(ctx: Context) {
	return util.extractRequest<schema.documentCreateCoupledRequestType>(
		ctx,
		schema.documentCreateCoupledRequest
	);
}

export function documentReadSingle(ctx: Context) {
	return util.extractRequest<schema.documentReadSingleRequestType>(
		ctx,
		schema.documentReadSingleRequest
	);
}

export function documentReadCouple(ctx: Context) {
	return util.extractRequest<schema.documentReadCoupleRequestType>(
		ctx,
		schema.documentReadCoupleRequest
	);
}

export function documentWriteSingle(ctx: Context) {
	return util.extractRequest<schema.documentWriteSingleRequestType>(
		ctx,
		schema.documentWriteSingleRequest
	);
}

export function documentWriteCouple(ctx: Context) {
	return util.extractRequest<schema.documentWriteCoupleRequestType>(
		ctx,
		schema.documentWriteCoupleRequest
	);
}

export function documentDeleteSingle(ctx: Context) {
	return util.extractRequest<schema.documentDeleteSingleRequestType>(
		ctx,
		schema.documentDeleteSingleRequest
	);
}

export function documentDeleteCouple(ctx: Context) {
	return util.extractRequest<schema.documentDeleteCoupleRequestType>(
		ctx,
		schema.documentDeleteCoupleRequest
	);
}

export function documentListSingle(ctx: Context) {
	return util.extractRequest<schema.documentListSingleRequestType>(
		ctx,
		schema.documentListSingleRequest
	);
}

export function documentListCouple(ctx: Context) {
	return util.extractRequest<schema.documentListCoupleRequestType>(
		ctx,
		schema.documentListCoupleRequest
	);
}

export function documentQuerySingle(ctx: Context) {
	return util.extractRequest<schema.documentQuerySingleRequestType>(
		ctx,
		schema.documentQuerySingleRequest
	);
}

export function documentQueryCouple(ctx: Context) {
	return util.extractRequest<schema.documentQueryCoupleRequestType>(
		ctx,
		schema.documentQueryCoupleRequest
	)
}
