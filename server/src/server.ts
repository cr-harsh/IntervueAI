import { app } from './app.js'
import { connectDatabase } from './config/database.js'
import { env } from './config/env.js'

async function start() {
  await connectDatabase()
  app.listen(env.port, () => console.log(`IntervueAI server listening on ${env.port}`))
}
start().catch(error => { console.error('Unable to start server:', error.message); process.exit(1) })
