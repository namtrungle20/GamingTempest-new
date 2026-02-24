import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Giúp sửa lỗi "React is not defined" bằng cách tự động xử lý JSX
      jsxRuntime: 'automatic'
    })
  ],
  resolve: {
    alias: {
      // Thiết lập alias @ để import file gọn hơn sau này
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})