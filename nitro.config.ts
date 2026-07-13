import { defineConfig } from 'nitro'

export default defineConfig({
  preset: 'vercel',
  vercel: {
    regions: ['iad1'],
  },
})
