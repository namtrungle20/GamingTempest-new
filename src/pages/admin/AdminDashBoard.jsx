import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import * as MuiStyles from '@mui/material/styles'
import { Link } from 'react-router-dom'
import useAdminDashBoard from '@/hook/admin/useAdminDashBoard'
import { ROLE_LABEL, USER_ROLE } from '@/constants/UserConstants'  // ✅ Đổi từ UserConstants


// ── StatCard ──────────────────────────────────────────────
const StatCard = ({ title, value, icon, color, path, loading }) => (
    <Mui.Paper
        elevation={0}
        component={Link}
        to={path}
        sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            transition: '0.2s',
            '&:hover': { borderColor: color, transform: 'translateY(-2px)', boxShadow: 4 },
        }}
    >
        <Mui.Box>
            <Mui.Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={1}>
                {title}
            </Mui.Typography>
            {loading
                ? <Mui.Skeleton width={60} height={40} />
                : <Mui.Typography variant="h4" fontWeight={900} color="text.primary" mt={0.5}>{value}</Mui.Typography>
            }
        </Mui.Box>
        <Mui.Box sx={{
            width: 52, height: 52, borderRadius: 2,
            bgcolor: `${color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
        }}>
            {icon}
        </Mui.Box>
    </Mui.Paper>
)

// ── AdminDashboard ────────────────────────────────────────
const AdminDashboard = () => {
    const { stats, recentUsers, loading, snackbar, closeSnackbar } = useAdminDashBoard()
    const theme = MuiStyles.useTheme()

    const STAT_CARDS = [
        { title: 'NGƯỜI DÙNG', key: 'users', icon: <Icon.PeopleOutlined />, color: theme.palette.primary.main, path: '/admin/users' },
        { title: 'SẢN PHẨM', key: 'products', icon: <Icon.Inventory2Outlined />, color: theme.palette.success.main, path: '/admin/products' },
        { title: 'ĐƠN HÀNG', key: 'orders', icon: <Icon.ShoppingCartOutlined />, color: theme.palette.info.main, path: '/admin/orders' },
    ]

    return (
        <Mui.Box>
            {/* Welcome */}
            <Mui.Box mb={4}>
                <Mui.Typography variant="h4" fontWeight={900} color="text.primary">
                    Tổng quan
                </Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" mt={0.5}>
                    Chào mừng trở lại, hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Mui.Typography>
            </Mui.Box>

            {/* Stat Cards */}
            <Mui.Grid container spacing={3} mb={4}>
                {STAT_CARDS.map(({ key, ...card }) => (
                    <Mui.Grid item xs={12} sm={6} md={4} key={key}>
                        <StatCard {...card} value={stats[key]} loading={loading} />
                    </Mui.Grid>
                ))}
            </Mui.Grid>

            {/* Recent Users */}
            <Mui.Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Mui.Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2} borderBottom="1px solid" borderColor="divider">
                    <Mui.Typography variant="subtitle1" fontWeight={900}>Người dùng mới nhất</Mui.Typography>
                    <Mui.Button component={Link} to="/admin/users" size="small" endIcon={<Icon.ArrowForward fontSize="small" />} sx={{ fontWeight: 700 }}>
                        Xem tất cả
                    </Mui.Button>
                </Mui.Box>

                {loading ? (
                    <Mui.Box p={3}>
                        {[...Array(5)].map((_, i) => <Mui.Skeleton key={i} height={52} sx={{ mb: 1 }} />)}
                    </Mui.Box>
                ) : recentUsers.length === 0 ? (
                    <Mui.Box p={4} textAlign="center">
                        <Mui.Typography color="text.secondary">Chưa có dữ liệu</Mui.Typography>
                    </Mui.Box>
                ) : (
                    <Mui.List disablePadding>
                        {recentUsers.map((user, index) => (
                            <Mui.ListItem key={user.id} divider={index < recentUsers.length - 1} sx={{ px: 3, py: 1.5 }}>
                                <Mui.ListItemAvatar>
                                    <Mui.Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                                        {user.displayName[0].toUpperCase()}
                                    </Mui.Avatar>
                                </Mui.ListItemAvatar>
                                <Mui.ListItemText
                                    primary={<Mui.Typography variant="body2" fontWeight={600}>{user.email || user.sdt}</Mui.Typography>}
                                    secondary={user.sdt || '—'}
                                />
                                <Mui.Chip
                                    label={ROLE_LABEL[user.vaitro] ?? user.vaitro}
                                    color={user.vaitro === USER_ROLE.ADMIN ? 'primary' : 'default'}
                                    size="small"
                                    sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                />
                            </Mui.ListItem>
                        ))}
                    </Mui.List>
                )}
            </Mui.Paper>

            {/* Snackbar */}
            <Mui.Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Mui.Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Mui.Alert>
            </Mui.Snackbar>
        </Mui.Box>
    )
}

export default AdminDashboard