import React, { useState } from 'react'
import * as Mui from '@mui/material'
import * as MuiStyles from '@mui/material/styles'
import * as Icon from '@mui/icons-material'
import { Link } from 'react-router-dom'

// Giữ nguyên các import file cá nhân
import logoWhite from '../../asset/TempestGaming_White_Fine.png'
import logoBlack from '../../asset/TempestGaming_Black_Fine.png'

import { NAV_ITEMS } from './../../constants/navData'
import { UI_SETTING } from '../../theme/uiSetting'
import LoginModal from './../auth/LoginModal'
import RegisterModal from '../auth/RegisterModal'
import useAuth from '../../hook/useAuth'

const Navbar = () => {
    // Sửa lỗi: Phải có dấu () sau useColorScheme
    const { mode, setMode } = MuiStyles.useColorScheme()
    const { user, login, logout, loading, error } = useAuth();

    const [activeMenu, setActiveMenu] = useState(null);
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSwitchToRegister = () => {
        setOpenLogin(false);
        setTimeout(() => { setOpenRegister(true); }, 200);
    };

    const handleSwitchToLogin = () => {
        setOpenRegister(false);
        setTimeout(() => { setOpenLogin(true); }, 200);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        logout();
    };

    const toggleMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light')
    }

    return (
        <Mui.Box onMouseLeave={() => setActiveMenu(null)}>
            <Mui.AppBar
                position='sticky'
                elevation={0}
                sx={{
                    height: UI_SETTING.NAVBAR_HEIGHT,
                    zIndex: UI_SETTING.Z_INDEX.NAVBAR,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundImage: 'none' // Quan trọng để dark mode ko bị đè màu
                }}
            >
                <Mui.Toolbar sx={{ justifyContent: 'space-between', height: '100%', py: 1 }}>
                    <Mui.Box
                        component={Link}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: { xs: '32px', md: '45px' },
                        }}
                    >
                        <Mui.Box
                            component="img"
                            src={mode === 'dark' ? logoWhite : logoBlack}
                            alt="Tempest Gaming Logo"
                            sx={{ height: '130%', width: 'auto', objectFit: 'contain' }}
                        />
                    </Mui.Box>

                    <Mui.Stack direction="row" spacing={1}>
                        <Mui.Button
                            onMouseEnter={() => setActiveMenu('brand')}
                            endIcon={<Icon.KeyboardArrowDown sx={{
                                transform: activeMenu === 'brand' ? 'rotate(180deg)' : 'none',
                                transition: '0.3s'
                            }} />}
                            sx={{ color: 'text.primary', fontWeight: 700 }}
                        >
                            Danh Mục
                        </Mui.Button>

                        <Mui.Button
                            onMouseEnter={() => setActiveMenu('product')}
                            endIcon={<Icon.KeyboardArrowDown sx={{
                                transform: activeMenu === 'product' ? 'rotate(180deg)' : 'none',
                                transition: '0.3s'
                            }} />}
                            sx={{ color: 'text.primary', fontWeight: 700 }}
                        >
                            Sản Phẩm
                        </Mui.Button>
                    </Mui.Stack>

                    <Mui.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Mui.IconButton color='inherit'>
                            <Icon.SearchOutlined />
                        </Mui.IconButton>

                        <Mui.IconButton onClick={toggleMode} color='inherit'>
                            {mode === 'dark' ? <Icon.LightModeOutlined /> : <Icon.DarkModeOutlined />}
                        </Mui.IconButton>

                        <Mui.IconButton color='inherit' component={Link} to='/cart'>
                            <Mui.Badge badgeContent={2} color='primary'>
                                <Icon.ShoppingBagOutlined />
                            </Mui.Badge>
                        </Mui.IconButton>

                        {!user ? (
                            <Mui.IconButton color='inherit' onClick={() => setOpenLogin(true)}>
                                <Icon.PersonOutlineOutlined />
                            </Mui.IconButton>
                        ) : (
                            <>
                                <Mui.IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                                    <Mui.Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '14px', fontWeight: 700 }}>TG</Mui.Avatar>
                                </Mui.IconButton>
                                <Mui.Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                    PaperProps={{ sx: { width: 200, mt: 1.5, boxShadow: 10, borderRadius: 2 } }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <Mui.MenuItem onClick={() => setAnchorEl(null)}><Icon.Person sx={{ mr: 2, fontSize: 20 }} /> Hồ sơ</Mui.MenuItem>
                                    <Mui.MenuItem onClick={() => setAnchorEl(null)}><Icon.Settings sx={{ mr: 2, fontSize: 20 }} /> Cài đặt</Mui.MenuItem>
                                    <Mui.Divider />
                                    <Mui.MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                                        <Icon.Logout sx={{ mr: 2, fontSize: 20 }} /> Đăng xuất
                                    </Mui.MenuItem>
                                </Mui.Menu>
                            </>
                        )}
                    </Mui.Box>
                </Mui.Toolbar>

                {/* MEGA MENU BRAND */}
                <Mui.Fade in={activeMenu === 'brand'}>
                    <Mui.Paper
                        sx={{
                            position: 'absolute', top: '100%', left: '50%',
                            transform: 'translateX(-50%)',
                            width: 'max-content',
                            maxWidth: '90vw',
                            bgcolor: 'background.paper',
                            boxShadow: 10,
                            p: 2,
                            borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
                            borderTop: '3px solid',
                            borderColor: 'primary.main',
                        }}
                    >
                        <Mui.Box sx={{ display: 'flex', gap: UI_SETTING.MEGA_MENU.ITEM_GAP }}>
                            {NAV_ITEMS.BRANDS.map((brand, index) => (
                                <Mui.Button
                                    key={index}
                                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                                >
                                    {brand}
                                </Mui.Button>
                            ))}
                        </Mui.Box>
                    </Mui.Paper>
                </Mui.Fade>

                {/* MEGA MENU PRODUCT */}
                <Mui.Fade in={activeMenu === 'product'}>
                    <Mui.Paper
                        sx={{
                            position: 'absolute', top: '100%', left: '50%',
                            transform: 'translateX(-50%)',
                            width: 'max-content',
                            maxWidth: '95vw',
                            bgcolor: 'background.paper',
                            p: UI_SETTING.MEGA_MENU.PANEL_PADDING,
                            borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
                            borderTop: '3px solid',
                            borderColor: 'primary.main',
                        }}
                    >
                        <Mui.Container maxWidth={UI_SETTING.LAYOUT.CONTAINER_MAX_WIDTH}>
                            <Mui.Box sx={{ display: 'flex', flexWrap: 'wrap', gap: UI_SETTING.MEGA_MENU.ITEM_GAP }}>
                                {NAV_ITEMS.PRODUCTS.map((cat, index) => (
                                    <Mui.Box key={index} sx={{ minWidth: '200px', flex: 1 }}>
                                        <Mui.Typography variant="subtitle1" fontWeight={900} color="primary.main" mb={2}>
                                            {cat.title}
                                        </Mui.Typography>
                                        <Mui.Stack spacing={1}>
                                            {cat.items.map((item, i) => (
                                                <Mui.Typography
                                                    key={i}
                                                    variant="body2"
                                                    sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main', pl: 0.5 }, transition: '0.2s' }}
                                                >
                                                    {item}
                                                </Mui.Typography>
                                            ))}
                                        </Mui.Stack>
                                    </Mui.Box>
                                ))}
                            </Mui.Box>
                        </Mui.Container>
                    </Mui.Paper>
                </Mui.Fade>
            </Mui.AppBar>

            <LoginModal
                open={openLogin}
                handleClose={() => setOpenLogin(false)}
                onSwitchRegister={handleSwitchToRegister}
                login={login}
                loading={loading}
                error={error}
            />
            <RegisterModal open={openRegister} handleClose={() => setOpenRegister(false)} onSwitchLogin={handleSwitchToLogin} />
        </Mui.Box>
    )
}

export default Navbar