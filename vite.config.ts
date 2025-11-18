import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Garante que o servidor seja acessível na rede
    port: 5173,
    hmr: {
        clientPort: 5173,
    },
    watch: {
      usePolling: true, // Adicionado para estabilidade no Windows
    },
  },
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            if (id.includes('react-router-dom')) {
              return 'router';
            }
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }
            if (id.includes('lucide-react')) {
              return 'lucide';
            }
          }
        }
      }
    }
  },
  
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'masked-icon.svg',
        'pwa-192x192.png',
        'pwa-512x512.png'
        // REMOVIDO 'manifest.webmanifest' daqui também para evitar duplicação manual
      ],
      strategies: 'generateSW',
      injectRegister: 'auto',
      
      devOptions: {
        enabled: false,
        type: 'module',
        navigateFallback: 'index.html',
      },

      workbox: {
        // CORREÇÃO 1: Removido 'webmanifest' desta lista para evitar o conflito
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        
        // CORREÇÃO 2: Adicionado globIgnores para ignorar explicitamente arquivos conflitantes
        globIgnores: [
          "**/node_modules/**/*",
          "**/manifest.webmanifest",
          "**/sw.js"
        ],

        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
             // ... Mantenha suas configurações de runtimeCaching aqui se houver ...
             // Exemplo padrão para cache de imagens se precisar:
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
                },
              },
            },
        ]
      },
      manifest: {
          name: 'StafferWork',
          short_name: 'StafferWork',
          description: 'Plataforma de contratação de serviços de gastronomia',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})