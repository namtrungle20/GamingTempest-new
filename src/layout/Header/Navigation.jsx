import { Typography, Box, Grid, Container } from '@mui/material'
import { Outlet } from 'react-router-dom' // Để render nội dung các trang vào đây
import Navbar from '../../components/nav/Navbar'

const Navigation = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh', // Luôn cao bằng màn hình
      bgcolor: 'background.default'
    }}>
      {/* Nav Danh mục cố định phía trên */}
      <Navbar />

      <Box component='main' sx={{ flexGrow: 1, py: { xs: 3, md: 6 } }}>
        <Container maxWidth='xl'>
          <Grid container spacing={4}>

            {/* CONTENT AREA (75% width) */}
            <Grid size={{ xs: 12, md: 9, lg: 9.5 }}>
              <Box sx={{
                minHeight: '80vh',
                // Nơi các trang như HomePage, ProductDetail sẽ hiển thị
              }}>
                <Outlet />
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* Footer chung */}
      <Box component='footer' sx={{ py: 4, textAlign: 'center', borderTop: '1px solid #333' }}>
        CONSOLE.GS © 2026
      </Box>
    </Box>
  )
}

export default Navigation