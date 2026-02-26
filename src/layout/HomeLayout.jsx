import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom'

const HomeLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Outlet này sẽ là nơi PageBuilder (trong HomePage) hiện lên */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet /> 
      </Box>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
        CONSOLE.GS © 2026
      </Box>
    </Box>
  )
}
export default HomeLayout