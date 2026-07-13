// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'automatic' })
  ],

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },

  server: {
    port: 5671,
    open: true,
    compress: true,
    historyApiFallback: true,
  },

  build: {
    chunkSizeWarningLimit: 500,
    target: 'esnext',

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui/icons-material')) return 'vendor-mui-icons'
            if (id.includes('@mui/material') ||
              id.includes('@mui/system') ||
              id.includes('@mui/base')) return 'vendor-mui'
            if (id.includes('@emotion')) return 'vendor-emotion'

            // ✅ Gộp chung react + react-dom + scheduler + react-is
            // Không tách riêng — tránh lỗi thứ tự khởi tạo (unstable_now)
            if (id.includes('react-dom') ||
              id.includes('/react/') ||
              id.includes('react-is') ||
              id.includes('scheduler')) return 'vendor-react'

            return 'vendor-misc'
          }
        }
      }
    }
  }
})