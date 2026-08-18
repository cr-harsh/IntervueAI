import 'dotenv/config'

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGODB_URI ?? '',
  aiServiceUrl: process.env.AI_SERVICE_URL ?? '',
  clientUrl: process.env.CLIENT_URL ?? 'http://127.0.0.1:5173',
  nodeEnv: process.env.NODE_ENV ?? 'development',
}
