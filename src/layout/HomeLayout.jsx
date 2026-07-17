import * as Mui from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/nav/Navbar'
import CartDrawer from '@/components/cart/CartDrawer'
import ChatWidget from '@/components/chat/ChatWidget'

const HomeLayout = () => {
    return (
        <Mui.Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Mui.Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Mui.Box>

            <Mui.Box component="footer" sx={{ py: 4, textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                CONSOLE.GS © 2026
            </Mui.Box>
            <CartDrawer />
            <ChatWidget />
        </Mui.Box>
    )
}

export default HomeLayout