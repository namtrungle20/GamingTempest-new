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
    chunkSizeWarningLimit: 800,
    target: 'esnext',

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // ✅ Chỉ tách icons riêng — đây là bộ file rất lớn nhưng độc lập,
            // không có circular dependency nên tách an toàn.
            if (id.includes('@mui/icons-material')) return 'vendor-mui-icons'

            // ✅ Gộp CHUNG toàn bộ react + react-dom + emotion + mui core
            // vì các package này phụ thuộc chéo lẫn nhau rất chặt —
            // tách riêng dễ gây lỗi "Cannot access X before initialization"
            // khi Rollup sắp thứ tự load module không đúng.
            return 'vendor-core'
          }
        }
      }
    }
  }
})