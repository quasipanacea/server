import { Application, Router, Context } from 'https://deno.land/x/oak/mod.ts' // TODO: version
import { path, z } from './mod.ts'
import { vars } from './util/vars.ts'
import * as util from './util/util.ts'
import * as documentUtils from './util/documentUtils.ts'
import * as sendUtils from './util/sendUtils.ts'

export const router = new Router()

router.post('/api/meta', (ctx) => {
	return sendUtils.json(ctx, vars)
})

router.post('/api/document/create', async (ctx) => {
	const schema = z.object({
		name: z.string().min(1),
	})
	const schemaResult = await util.extractData<typeof schema>(ctx, schema)
	if (!schemaResult.success) {
		return sendUtils.error(ctx, schemaResult.data)
	}
	const { name } = schemaResult.data

	const apiResult = await documentUtils.documentCreate(name)
	if (!apiResult.success) {
		return sendUtils.error(ctx, apiResult.data)
	}

	return sendUtils.success(ctx)
})

router.post('/api/document/read', async (ctx) => {
	const schema = z.object({
		name: z.string().min(1),
	})
	const schemaResult = await util.extractData<typeof schema>(ctx, schema)
	if (!schemaResult.success) {
		return sendUtils.error(ctx, schemaResult.data)
	}

	const { name } = schemaResult.data

	const apiResult = await documentUtils.documentRead(name)
	if (!apiResult.success) {
		return sendUtils.error(ctx, apiResult.data)
	}

	return sendUtils.json(ctx, {
		content: apiResult.data,
	})
})

router.post('/api/document/write', async (ctx) => {
	const schema = z.object({
		name: z.string().min(1),
		content: z.string(),
	})
	const schemaResult = await util.extractData<typeof schema>(ctx, schema)
	if (!schemaResult.success) {
		return sendUtils.error(ctx, schemaResult.data)
	}

	const { name, content } = schemaResult.data

	const apiResult = await documentUtils.documentWrite(name, content)
	if (!apiResult.success) {
		return sendUtils.error(ctx, apiResult.data)
	}

	return sendUtils.success(ctx)
})

router.post('/api/document/list', async (ctx) => {
	const apiResult = await documentUtils.documentList()
	if (!apiResult.success) {
		return sendUtils.error(ctx, apiResult.data)
	}

	return sendUtils.json(ctx, {
		documents: apiResult.data,
	})
})

// UniqueDocuments

router.post('/api/uniqueDocument/read', async (ctx) => {
	const schema = z.object({
		context: z.string().min(1),
		id: z.string().min(1),
	})
	const schemaResult = await util.extractData<typeof schema>(ctx, schema)
	if (!schemaResult.success) {
		return sendUtils.error(ctx, schemaResult.data)
	}
	const { context, id } = schemaResult.data

	const readResult = await documentUtils.uniqueDocumentRead(context, id)
})

router.post('/api/uniqueDocument/list', async (ctx) => {
	const schema = z.object({
		context: z.string().min(1),
	})
	const schemaResult = await util.extractData<typeof schema>(ctx, schema)
	if (!schemaResult.success) {
		return sendUtils.error(ctx, schemaResult.data)
	}
	const { context } = schemaResult.data

	const arr = await documentUtils.uniqueDocumentList(context)
	return sendUtils.json(ctx, {
		documents: arr,
	})
})
