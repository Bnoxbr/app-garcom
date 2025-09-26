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
      // ... (Restante da configuração do build mantida)
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
  
  // CORREÇÃO: Plugin sempre carregado para injetar módulos virtuais
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'masked-icon.svg',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'manifest.webmanifest'
      ],
      strategies: 'generateSW',
      injectRegister: 'auto',
      
      // SOLUÇÃO PARA O CONFLITO: Desativar o Service Worker em desenvolvimento
      devOptions: {
        // Se estiver em desenvolvimento, não force o service worker
        enabled: false,
        type: 'module',
        navigateFallback: 'index.html',
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg,jpeg,webmanifest}'],
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
            // ... (suas configurações de runtimeCaching)
        ]
      },
      manifest: {
          // ... (sua configuração de manifest mantida)
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})