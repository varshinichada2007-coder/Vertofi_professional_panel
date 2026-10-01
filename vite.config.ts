import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import dns from 'dns'

// DNS fix for Windows SRV lookups with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4'])
} catch {
  // Ignore
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.MONGODB_URI) process.env.MONGODB_URI = env.MONGODB_URI
  if (env.MONGODB_DB_NAME) process.env.MONGODB_DB_NAME = env.MONGODB_DB_NAME

  return {
    plugins: [
      react(),
      {
        name: 'netlify-functions-dev-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url && req.url.startsWith('/.netlify/functions/api')) {
              let body = ''
              req.on('data', (chunk) => {
                body += chunk
              })
              req.on('end', async () => {
                try {
                  const { handler } = await import('./netlify/functions/api.ts')
                  const urlObj = new URL(req.url!, 'http://localhost')
                  const qs: Record<string, string> = {}
                  urlObj.searchParams.forEach((v, k) => {
                    qs[k] = v
                  })

                  const event = {
                    httpMethod: req.method || 'GET',
                    path: urlObj.pathname,
                    queryStringParameters: qs,
                    headers: req.headers as Record<string, string>,
                    body: body || null
                  }

                  const result = await handler(event as any, {} as any)
                  if (result) {
                    res.statusCode = result.statusCode || 200
                    if (result.headers) {
                      Object.entries(result.headers).forEach(([k, v]) => {
                        res.setHeader(k, v as string)
                      })
                    }
                    res.end(result.body || '')
                  } else {
                    res.statusCode = 500
                    res.end(JSON.stringify({ error: 'No response from function' }))
                  }
                } catch (err: any) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: err.message }))
                }
              })
            } else {
              next()
            }
          })
        }
      }
    ]
  }
})

