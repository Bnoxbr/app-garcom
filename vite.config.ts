import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // MANTIDO ATIVO

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';

  const plugins = [
    react(),
    // Ativa o PWA apenas em produção
    isProduction && VitePWA({
      registerType: 'prompt',
      strategies: 'generateSW',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg}'],
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
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
  ].filter(Boolean); // Filtra valores falsy (como o PWA em dev)

  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
      hmr: false, // Desativa o Hot Module Replacement
      // HMR agora pode ser reativado, pois o PWA não irá interferir
      watch: {
        usePolling: true,
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
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});