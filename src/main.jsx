import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
// import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme/theme.js'
import { CssVarsProvider } from '@mui/material/styles'
import { AuthProvider } from '../src/hook/provider/AuthProvider'
import { CartProvider } from './hook/provider/CartProvider'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/vi'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='vi'>
            <App />
          </LocalizationProvider>
        </CartProvider>
      </AuthProvider>
    </CssVarsProvider>
  </StrictMode>
)
