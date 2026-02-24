import { extendTheme } from '@mui/material/styles'

export const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: { main: '#ff8906' },
                background: { default: '#ffffff', paper: '#f5f5f7' },
                text: { primary: '#0f0e17', secondary: '#a7a9be' }
            }
        },
        dark: {
            palette: {
                primary: { main: '#ff8906' },
                background: { default: '#0f0e17', paper: '#0f0e17' },
                text: { primary: '#fffffe', secondary: '#a7a9be' }
            }
        }
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h1: { color: '#fffffe' },
        body1: { color: '#a7a9be' }
    },
    // Sửa lỗi spacing: MUI mặc định là 8px (số 2 = 16px)
    spacing: 8,
    shape: {
        borderRadius: 4
    }
})

// Export thêm bản thô để bạn dùng với Tailwind/Inline Style nếu cần
export const tokens = {
    illustration: {
        main: '#fffffe',
        highlight: '#ff8906',
        secondary: '#f25f4c',
        tertiary: '#e53170',
        stroke: '#000000'
    }
}