import { Application } from './mod.ts'
import { router } from './routes.ts'
import { vars } from './util/vars.ts'

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

console.info(`Listening on port ${vars.port}`)
await app.listen({ port: vars.port })
