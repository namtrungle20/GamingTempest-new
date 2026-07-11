import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import * as Mui from '@mui/material';
import * as MuiStyles from '@mui/material/styles';
import * as Icon from '@mui/icons-material';
import { useAuth } from '@/hook/provider/AuthContext';
import logoWhite from '../../../asset/TempestGaming_White_Fine.png';
import logoBlack from '../../../asset/TempestGaming_Black_Fine.png';

const SIDEBAR_WIDTH = 260;

const NAV_ITEMS = [
    { label: 'Dashboard', icon: <Icon.DashboardOutlined />, path: '/admin' },
    { label: 'Người dùng', icon: <Icon.PeopleOutlined />, path: '/admin/users' },
    { label: 'Sản phẩm', icon: <Icon.Inventory2Outlined />, path: '/admin/products' },
    { label: 'Đơn hàng', icon: <Icon.ShoppingCartOutlined />, path: '/admin/orders' },
    { label: 'Đánh Giá', icon: <Icon.Star />, path: '/admin/danhgia' }
];

const AdminLayout = () => {
    const { mode, setMode } = MuiStyles.useColorScheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const SidebarContent = () => (
        <Mui.Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Logo */}
            <Mui.Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Mui.Box
                    component={Link}
                    to="/"
                    sx={{ display: 'flex', alignItems: 'center', height: 40 }}
                >
                    <Mui.Box
                        component="img"
                        src={mode === 'dark' ? logoWhite : logoBlack}
                        alt="Tempest Gaming"
                        sx={{ height: '100%', width: 'auto', objectFit: 'contain' }}
                    />
                </Mui.Box>
                <Mui.Chip
                    label="ADMIN PANEL"
                    size="small"
                    sx={{
                        mt: 1.5,
                        bgcolor: 'primary.main',
                        color: '#fff',
                        fontWeight: 900,
                        fontSize: '0.65rem',
                        letterSpacing: 1
                    }}
                />
            </Mui.Box>

            {/* Nav Items */}
            <Mui.Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
                <Mui.Typography variant="caption" color="text.secondary" sx={{ px: 1, fontWeight: 700, letterSpacing: 1 }}>
                    QUẢN LÝ
                </Mui.Typography>
                <Mui.Stack spacing={0.5} mt={1}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Mui.ButtonBase
                                key={item.path}
                                component={Link}
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1.2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    justifyContent: 'flex-start',
                                    bgcolor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? '#fff' : 'text.secondary',
                                    fontWeight: isActive ? 700 : 400,
                                    transition: '0.2s',
                                    '&:hover': {
                                        bgcolor: isActive ? 'primary.main' : 'action.hover',
                                        color: isActive ? '#fff' : 'text.primary',
                                    }
                                }}
                            >
                                <Mui.Box sx={{ fontSize: 20, display: 'flex' }}>{item.icon}</Mui.Box>
                                <Mui.Typography variant="body2" fontWeight="inherit" color="inherit">
                                    {item.label}
                                </Mui.Typography>
                            </Mui.ButtonBase>
                        );
                    })}
                </Mui.Stack>
            </Mui.Box>

            {/* User Info + Logout */}
            <Mui.Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Mui.Stack direction="row" alignItems="center" spacing={1.5} mb={1.5}>
                    <Mui.Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                        {user?.displayName?.charAt(0).toUpperCase()}
                    </Mui.Avatar>
                    <Mui.Box>
                        <Mui.Typography variant="body2" fontWeight={700} color="text.primary">
                            {user?.displayName}
                        </Mui.Typography>
                        <Mui.Typography variant="caption" color="text.secondary">
                            Administrator
                        </Mui.Typography>
                    </Mui.Box>
                </Mui.Stack>
                <Mui.ButtonBase
                    onClick={handleLogout}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        px: 2, py: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        justifyContent: 'flex-start',
                        color: 'error.main',
                        '&:hover': { bgcolor: 'action.hover' }
                    }}
                >
                    <Icon.LogoutOutlined fontSize="small" />
                    <Mui.Typography variant="body2" color="inherit" fontWeight={600}>Đăng xuất</Mui.Typography>
                </Mui.ButtonBase>
            </Mui.Box>
        </Mui.Box>
    );

    return (
        <Mui.Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar Desktop */}
            <Mui.Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: SIDEBAR_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: SIDEBAR_WIDTH,
                        boxSizing: 'border-box',
                        bgcolor: 'background.paper',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                    }
                }}
            >
                <SidebarContent />
            </Mui.Drawer>

            {/* Sidebar Mobile */}
            <Mui.Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: SIDEBAR_WIDTH,
                        bgcolor: 'background.paper',
                    }
                }}
            >
                <SidebarContent />
            </Mui.Drawer>

            {/* Main Content */}
            <Mui.Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Topbar */}
                <Mui.AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundImage: 'none'
                    }}
                >
                    <Mui.Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Mui.IconButton
                            sx={{ display: { md: 'none' }, color: 'text.primary' }}
                            onClick={() => setMobileOpen(true)}
                        >
                            <Icon.MenuOutlined />
                        </Mui.IconButton>

                        {/* Breadcrumb */}
                        <Mui.Typography variant="body1" fontWeight={700} color="text.primary">
                            {NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'Admin'}
                        </Mui.Typography>

                        <Mui.Stack direction="row" spacing={1} alignItems="center">
                            <Mui.IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit" sx={{ color: 'text.primary' }}>
                                {mode === 'dark' ? <Icon.LightModeOutlined /> : <Icon.DarkModeOutlined />}
                            </Mui.IconButton>
                            <Mui.IconButton component={Link} to="/" color="inherit" sx={{ color: 'text.primary' }}>
                                <Mui.Tooltip title="Về trang chủ">
                                    <Icon.HomeOutlined />
                                </Mui.Tooltip>
                            </Mui.IconButton>
                        </Mui.Stack>
                    </Mui.Toolbar>
                </Mui.AppBar>

                {/* Page Content: Đảm bảo width chiếm 100% không gian và phân bổ padding chuẩn */}
                <Mui.Box sx={{ flex: 1, width: '100%', p: { xs: 2.5, md: 4 }, display: 'flex', flexDirection: 'column' }}>
                    <Outlet />
                </Mui.Box>
            </Mui.Box>
        </Mui.Box>
    );
};

export default AdminLayout;