import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import * as MuiStyles from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useAdminDashBoard from '@/hook/admin/useAdminDashBoard'
import { ROLE_LABEL, USER_ROLE } from '@/constants/UserConstants'

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
const fmtCompact = (n) => new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(n)

// ── StatCard — giữ nguyên ──────────────────────────────────
const StatCard = ({ title, value, icon, color, path, loading }) => (
    <Mui.Paper
        elevation={0}
        component={Link}
        to={path}
        sx={{
            p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            textDecoration: 'none', transition: '0.2s',
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
            width: 52, height: 52, borderRadius: 2, bgcolor: `${color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color,
        }}>
            {icon}
        </Mui.Box>
    </Mui.Paper>
)

// ── Revenue Chart ───────────────────────────────────────────
const RevenueChart = ({ data, loading }) => (
    <Mui.Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
        <Mui.Typography variant="subtitle1" fontWeight={900} mb={2}>
            Doanh thu 7 ngày gần nhất
        </Mui.Typography>
        {loading ? (
            <Mui.Skeleton variant="rectangular" height={280} sx={{ borderRadius: 1 }} />
        ) : (
            <Mui.Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="ngay" fontSize={12} />
                        <YAxis fontSize={12} tickFormatter={fmtCompact} />
                        <Tooltip formatter={(v) => fmt(v)} />
                        <Line type="monotone" dataKey="doanhthu" stroke="#FF8906" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Mui.Box>
        )}
    </Mui.Paper>
)

// ── Top Products ────────────────────────────────────────────
const TopProducts = ({ data, loading }) => (
    <Mui.Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider', height: '100%' }}>
        <Mui.Typography variant="subtitle1" fontWeight={900} mb={2}>
            Top sản phẩm bán chạy
        </Mui.Typography>
        {loading ? (
            [...Array(5)].map((_, i) => <Mui.Skeleton key={i} height={48} sx={{ mb: 1 }} />)
        ) : data.length === 0 ? (
            <Mui.Typography color="text.secondary" variant="body2">Chưa có dữ liệu</Mui.Typography>
        ) : (
            <Mui.Stack spacing={1.5}>
                {data.map((item, i) => (
                    <Mui.Box key={item.sanpham_id} display="flex" alignItems="center" gap={1.5}>
                        <Mui.Typography variant="body2" fontWeight={800} color="text.disabled" sx={{ width: 20 }}>
                            {i + 1}
                        </Mui.Typography>
                        <Mui.Box flex={1} minWidth={0}>
                            <Mui.Typography variant="body2" fontWeight={600} noWrap>{item.ten}</Mui.Typography>
                            <Mui.Typography variant="caption" color="text.secondary">
                                Đã bán {item.soLuongBan}
                            </Mui.Typography>
                        </Mui.Box>
                    </Mui.Box>
                ))}
            </Mui.Stack>
        )}
    </Mui.Paper>
)

// ── AdminDashboard ────────────────────────────────────────
const AdminDashboard = () => {
    const {
        stats, recentUsers, loading, snackbar, closeSnackbar,
        revenueByDay, topProducts, statsLoading,   // ✅ cần bổ sung vào hook
    } = useAdminDashBoard()
    const theme = MuiStyles.useTheme()

    const STAT_CARDS = [
        { title: 'NGƯỜI DÙNG', key: 'users', icon: <Icon.PeopleOutlined />, color: theme.palette.primary.main, path: '/admin/users' },
        { title: 'SẢN PHẨM', key: 'products', icon: <Icon.Inventory2Outlined />, color: theme.palette.success.main, path: '/admin/products' },
        { title: 'ĐƠN HÀNG', key: 'orders', icon: <Icon.ShoppingCartOutlined />, color: theme.palette.info.main, path: '/admin/orders' },
        { title: 'DOANH THU', key: 'revenue', icon: <Icon.AttachMoneyOutlined />, color: theme.palette.warning.main, path: '/admin/orders' },
    ]

    return (
        <Mui.Box>
            <Mui.Box mb={4}>
                <Mui.Typography variant="h4" fontWeight={900} color="text.primary">Tổng quan</Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" mt={0.5}>
                    Chào mừng trở lại, hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Mui.Typography>
            </Mui.Box>

            {/* Stat Cards — giờ 4 cột */}
            <Mui.Grid container spacing={3} mb={4}>
                {STAT_CARDS.map(({ key, ...card }) => (
                    <Mui.Grid item xs={12} sm={6} md={3} key={key}>
                        <StatCard {...card} value={key === 'revenue' ? fmt(stats[key] || 0) : stats[key]} loading={loading} />
                    </Mui.Grid>
                ))}
            </Mui.Grid>

            {/* Chart + Top sản phẩm */}
            <Mui.Grid container spacing={3} mb={4}>
                <Mui.Grid item xs={12} md={8}>
                    <RevenueChart data={revenueByDay} loading={statsLoading} />
                </Mui.Grid>
                <Mui.Grid item xs={12} md={4}>
                    <TopProducts data={topProducts} loading={statsLoading} />
                </Mui.Grid>
            </Mui.Grid>

            {/* Recent Users — giữ nguyên toàn bộ phần này */}
            <Mui.Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                {/* ... giữ nguyên y hệt code cũ ... */}
            </Mui.Paper>

            <Mui.Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Mui.Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Mui.Alert>
            </Mui.Snackbar>
        </Mui.Box>
    )
}

export default AdminDashboard