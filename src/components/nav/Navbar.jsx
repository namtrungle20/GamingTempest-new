import React, { useState } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, useColorScheme, Stack, Paper, Grid, Fade } from '@mui/material'
import { ShoppingBagOutlined, DarkModeOutlined, LightModeOutlined, SearchOutlined } from '@mui/icons-material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom'
import logo from '../../asset/TempestGaming_White_Fine.png'
import { NAV_ITEMS } from './../../constants/navData';


const Navbar = () => {
    const { mode, setMode } = useColorScheme()
    const [activeMenu, setActiveMenu] = useState(null);

    const toggleMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light')
    }

    return (
        <div>
            <AppBar
                position='sticky'
                elevation={0}
                sx={{
                    bgcolor: 'background.default',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundImage: 'none'
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    {/* LOGO - Khu vực chứa ảnh */}
                    <Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            height: { xs: '32px', md: '45px' }, // Khống chế chiều cao khung Logo
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="Console.GS Logo"
                            sx={{
                                height: '100%', // Ảnh cao bằng khung bao ngoài
                                width: 'auto',   // Rộng tự động theo tỷ lệ
                                objectFit: 'contain',
                                // Nếu muốn hiệu ứng Gaming rực rỡ, thêm drop-shadow:
                                filter: 'drop-shadow(0px 0px 4px rgba(238, 232, 225, 0.3))'
                            }}
                        />
                    </Box>

                    <Box
                        onMouseLeave={() => setActiveMenu(null)}
                        sx={{ display: 'flex', gap: 2, position: 'relative', height: '64px', alignItems: 'center' }}
                    >

                        {/* 1. NÚT DANH MỤC (DROPDOWN) */}
                        <Button
                            onMouseEnter={() => setActiveMenu('brand')}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ color: 'text.primary', fontWeight: 700 }}
                        >
                            Danh Mục
                        </Button>

                        {/* 2. NÚT SẢN PHẨM (MEGA MENU) */}
                        <Button
                            onMouseEnter={() => setActiveMenu('product')}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{ color: 'text.primary', fontWeight: 700 }}
                        >
                            Sản Phẩm
                        </Button>

                        {/* --- PHẦN VẼ MENU --- */}

                        {/* TYPE 1: DROPDOWN (Thương hiệu) - Hẹp, đổ dọc */}
                        <Fade in={activeMenu === 'brand'}>
                            <Paper
                                sx={{
                                    position: 'absolute', top: '100%', left: 0,
                                    width: '200px', // Hẹp
                                    bgcolor: 'background.paper',
                                    boxShadow: 5, p: 1, zIndex: 1000
                                }}
                            >
                                {NAV_ITEMS.BRANDS.map((brand) => (
                                    <Button key={brand} fullWidth sx={{ justifyContent: 'flex-start', color: 'text.secondary' }}>
                                        {brand}
                                    </Button>
                                ))}
                            </Paper>
                        </Fade>

                        {/* TYPE 2: MEGA MENU (Sản phẩm) - Rộng, chia cột */}
                        <Fade in={activeMenu === 'product'}>
                            <Paper
                                sx={{
                                    position: 'absolute', top: '100%', left: -100, // Lùi lại để cân bằng layout
                                    width: '800px', // Rộng
                                    bgcolor: 'background.paper',
                                    boxShadow: 10, p: 4, zIndex: 1000,
                                    borderTop: '2px solid', borderColor: 'primary.main'
                                }}
                            >
                                <Grid container spacing={3}>
                                    {NAV_ITEMS.PRODUCTS.map((cat) => (
                                        <Grid item xs={4} key={cat.title}>
                                            <Typography variant="subtitle1" fontWeight={900} color="primary.main" mb={1}>
                                                {cat.title}
                                            </Typography>
                                            <Stack spacing={0.5}>
                                                {cat.items.map((item) => (
                                                    <Typography
                                                        key={item}
                                                        variant="body2"
                                                        sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                                    >
                                                        {item}
                                                    </Typography>
                                                ))}
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        </Fade>

                    </Box>

                    {/* ACTIONS */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton color='inherit'>
                            <SearchOutlined />
                        </IconButton>

                        <IconButton onClick={toggleMode} color='inherit'>
                            {mode === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
                        </IconButton>

                        <IconButton color='inherit' component={Link} to='/cart'>
                            <Badge badgeContent={2} color='primary'>
                                <ShoppingBagOutlined />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar