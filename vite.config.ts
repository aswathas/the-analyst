import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'seneca.jpg'],
      manifest: {
        name: 'Analyst — Sem 6 Prep',
        short_name: 'Analyst',
        description: 'SRM Institute semester exam intelligence. 4 PYQs analyzed per subject.',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,jpg,png,woff2}'],
        // Prevent SW from intercepting PDF/video navigation — serve them directly from the network
        navigateFallbackDenylist: [/\.pdf$/, /\.mp4$/],
        runtimeCaching: [
          {
            urlPattern: /\.mp4$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              expiration: { maxEntries: 2, maxAgeSeconds: 7 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /\.pdf$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pdf-cache',
              expiration: { maxEntries: 2, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
})
