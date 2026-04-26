import { useState, useRef } from 'react'
import * as Mui from '@mui/material'
import * as MuiStyles from '@mui/material/styles'
import * as Icon from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useCart } from '../../hook/provider/CartProvider'



import logoWhite from '../../asset/TempestGaming_White_Fine.png'
import logoBlack from '../../asset/TempestGaming_Black_Fine.png'
import { UI_SETTING } from '../../theme/uiSetting'
import LoginModal from '../auth/LoginModal'
import RegisterModal from '../auth/RegisterModal'
import useAuth from '../../hook/useAuth'
import CartDrawer from '../cart/CartDrawer'
import useNavCategories from '@/hook/useNavCategories'

const NAV_ITEMS = [
    {
        label: 'Dịch vụ', key: 'service',
        items: [
            { label: 'Sửa chữa', to: '/services/repair' },
            { label: 'Thu cũ đổi mới', to: '/services/trade-in' },
        ]
    },
    {
        label: 'Tin tức', key: 'news',
        to: '/news',
    },
]

const NavItem = ({ nav, activeMenu, setActiveMenu }) => {
    const anchorRef = useRef(null)
    const isOpen = activeMenu === nav.key

    if (nav.to) {
        return (
            <Mui.Button
                component={Link} to={nav.to}
                sx={{
                    color: 'text.primary', fontWeight: 700,
                    fontSize: '0.875rem', px: 1.5, borderRadius: 1,
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                }}
            >
                {nav.label}
            </Mui.Button>
        )
    }

    return (
        <Mui.Box
            ref={anchorRef}
            onMouseEnter={() => setActiveMenu(nav.key)}
            onMouseLeave={() => setActiveMenu(null)}
            sx={{ position: 'relative' }}
        >
            <Mui.Button
                endIcon={
                    <Icon.KeyboardArrowDown sx={{
                        fontSize: '1rem !important',
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: '0.2s'
                    }} />
                }
                sx={{
                    color: isOpen ? 'primary.main' : 'text.primary',
                    fontWeight: 700, fontSize: '0.875rem', px: 1.5, borderRadius: 1,
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                }}
            >
                {nav.label}
            </Mui.Button>

            {/* ✅ Popper thay Menu — không có backdrop, hover tự do */}
            <Mui.Popper
                open={isOpen}
                anchorEl={anchorRef.current}
                placement="bottom-start"
                disablePortal={false}
                style={{ zIndex: 1200 }}
            >
                <Mui.Paper
                    elevation={4}
                    sx={{
                        mt: 0.5,
                        minWidth: 180,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderTop: '2px solid',
                        borderTopColor: 'primary.main',
                        borderRadius: '0 0 10px 10px',
                        py: 0.5,
                    }}
                >
                    {nav.items.map((item, i) => (
                        <Mui.MenuItem
                            key={i}
                            component={Link}
                            to={item.to}
                            onClick={() => setActiveMenu(null)}
                            sx={{
                                fontSize: '0.875rem', fontWeight: 500,
                                '&:hover': { color: 'primary.main' }
                            }}
                        >
                            {item.label}
                        </Mui.MenuItem>
                    ))}
                </Mui.Paper>
            </Mui.Popper>
        </Mui.Box>
    )
}

const Navbar = () => {
    const { mode, setMode } = MuiStyles.useColorScheme()
    const { navItems } = useNavCategories()
    const { user, login, logout, loading, error } = useAuth()

    const [activeMenu, setActiveMenu] = useState(null)
    const [openLogin, setOpenLogin] = useState(false)
    const [openRegister, setOpenRegister] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const { totalItems, setIsCartOpen } = useCart()

    const allNavItems = [...navItems, ...NAV_ITEMS]

    const handleSwitchToRegister = () => {
        setOpenLogin(false)
        setTimeout(() => setOpenRegister(true), 200)
    }

    const handleSwitchToLogin = () => {
        setOpenRegister(false)
        setTimeout(() => setOpenLogin(true), 200)
    }

    return (
        <Mui.Box>
            <Mui.AppBar
                position='sticky'
                elevation={0}
                sx={{
                    height: UI_SETTING.NAVBAR_HEIGHT,
                    zIndex: UI_SETTING.Z_INDEX.NAVBAR,
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundImage: 'none',
                }}
            >
                <Mui.Toolbar sx={{ justifyContent: 'space-between', height: '100%', px: { xs: 2, md: 4 } }}>

                    {/* Logo */}
                    <Mui.Box
                        component={Link} to="/"
                        sx={{ display: 'flex', alignItems: 'center', height: { xs: '32px', md: '42px' }, flexShrink: 0 }}
                    >
                        <Mui.Box
                            component="img"
                            src={mode === 'dark' ? logoWhite : logoBlack}
                            alt="Tempest Gaming"
                            sx={{ height: '130%', width: 'auto', objectFit: 'contain' }}
                        />
                    </Mui.Box>

                    {/* Nav */}
                    <Mui.Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {allNavItems.map((nav) => (  // ← đổi NAV_ITEMS thành allNavItems
                            <NavItem
                                key={nav.key}
                                nav={nav}
                                activeMenu={activeMenu}
                                setActiveMenu={setActiveMenu}
                            />
                        ))}
                    </Mui.Stack>

                    {/* Icons */}
                    <Mui.Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                        <Mui.IconButton size="medium" color='inherit'>
                            <Icon.SearchOutlined fontSize="medium" />
                        </Mui.IconButton>

                        <Mui.IconButton size="medium" onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color='inherit'>
                            {mode === 'dark' ? <Icon.LightModeOutlined fontSize="medium" /> : <Icon.DarkModeOutlined fontSize="medium" />}
                        </Mui.IconButton>

                        <Mui.IconButton size="medium" color='inherit' onClick={() => setIsCartOpen(true)} >
                            <Mui.Badge badgeContent={totalItems} color='primary' sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}>
                                <Icon.ShoppingBagOutlined fontSize="medium" />
                            </Mui.Badge>
                        </Mui.IconButton>

                        {!user ? (
                            <Mui.IconButton size="medium" color='inherit' onClick={() => setOpenLogin(true)}>
                                <Icon.PersonOutlineOutlined fontSize="medium" />
                            </Mui.IconButton>
                        ) : (
                            <>
                                <Mui.IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5, ml: 0.5 }}>
                                    <Mui.Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main', fontSize: '0.8rem', fontWeight: 700 }}>
                                        {user.displayName[0].toUpperCase()}
                                    </Mui.Avatar>
                                </Mui.IconButton>
                                <Mui.Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={() => setAnchorEl(null)}
                                    PaperProps={{ sx: { width: 200, mt: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' } }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                    elevation={4}
                                >
                                    <Mui.Box px={2} py={1.5} borderBottom="1px solid" borderColor="divider">
                                        <Mui.Typography variant="body2" fontWeight={700}>{user.displayName}</Mui.Typography>
                                        <Mui.Typography variant="caption" color="text.secondary">{user.email || user.sdt}</Mui.Typography>
                                    </Mui.Box>
                                    <Mui.MenuItem component={Link} to="/profile" onClick={() => setAnchorEl(null)} sx={{ mt: 0.5 }}>
                                        <Icon.Person sx={{ mr: 1.5, fontSize: 18 }} /> Hồ sơ
                                    </Mui.MenuItem>
                                    <Mui.MenuItem component={Link} to="/donhang" onClick={() => setAnchorEl(null)}>
                                        <Icon.ShoppingBag sx={{ mr: 1.5, fontSize: 18 }} /> Đơn hàng
                                    </Mui.MenuItem>
                                    <Mui.MenuItem onClick={() => setAnchorEl(null)}>
                                        <Icon.Settings sx={{ mr: 1.5, fontSize: 18 }} /> Cài đặt
                                    </Mui.MenuItem>
                                    {user?.isAdmin && <Mui.Divider />}
                                    {user?.isAdmin && (
                                        <Mui.MenuItem
                                            component={Link} to="/admin"
                                            onClick={() => setAnchorEl(null)}
                                            sx={{ color: 'primary.main', fontWeight: 700 }}
                                        >
                                            <Icon.AdminPanelSettingsOutlined sx={{ mr: 1.5, fontSize: 18 }} />
                                            Trang quản trị
                                        </Mui.MenuItem>
                                    )}
                                    < Mui.Divider />
                                    <Mui.MenuItem onClick={() => { setAnchorEl(null); logout() }} sx={{ color: 'error.main' }}>
                                        <Icon.Logout sx={{ mr: 1.5, fontSize: 18 }} /> Đăng xuất
                                    </Mui.MenuItem>
                                </Mui.Menu>
                            </>
                        )}
                    </Mui.Box>
                </Mui.Toolbar>
            </Mui.AppBar>

            <LoginModal
                open={openLogin}
                handleClose={() => setOpenLogin(false)}
                onSwitchRegister={handleSwitchToRegister}
                login={login}
                loading={loading}
                error={error}
            />
            <RegisterModal
                open={openRegister}
                handleClose={() => setOpenRegister(false)}
                onSwitchLogin={handleSwitchToLogin}
            />
            <CartDrawer />
        </Mui.Box>
    )
}

export default Navbar