import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import * as MuiStyles from '@mui/material/styles'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import useAdminDashBoard from '@/hook/admin/useAdminDashBoard'

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
const fmtCompact = (n) => new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(n)
const fmtPercent = (n) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`

// ── StatCard (Bung rộng padding, fix tràn số Doanh Thu) ──────────────────────
const StatCard = ({ title, value, growth, icon, color, path, loading }) => (
    <Mui.Paper
        elevation={0}
        component={Link}
        to={path}
        sx={{
            p: 3, // Tăng padding từ 2 lên 3 giúp card dày dặn, sang hơn
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            textDecoration: 'none',
            transition: 'all 0.2s ease-in-out',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            '&:hover': { borderColor: color, transform: 'translateY(-3px)' },
        }}
    >
        <Mui.Box>
            <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Mui.Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ letterSpacing: '0.5px' }}>
                    {title}
                </Mui.Typography>
                <Mui.Box sx={{
                    width: 32, height: 32, borderRadius: 2, bgcolor: `${color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color,
                    flexShrink: 0,
                }}>
                    {icon}
                </Mui.Box>
            </Mui.Box>

            {loading ? (
                <Mui.Skeleton width="80%" height={36} />
            ) : (
                // Hạ nhẹ size chữ doanh thu xuống một chút để vừa vặn hoàn hảo trong card
                <Mui.Typography variant="h5" fontWeight={800} color="text.primary" sx={{ fontSize: '1.4rem', lineHeight: 1.2 }}>
                    {value}
                </Mui.Typography>
            )}
        </Mui.Box>

        {!loading && growth != null && (
            <Mui.Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
                {growth >= 0
                    ? <Icon.TrendingUpOutlined sx={{ fontSize: 16, color: 'success.main' }} />
                    : <Icon.TrendingDownOutlined sx={{ fontSize: 16, color: 'error.main' }} />
                }
                <Mui.Typography variant="caption" fontWeight={700} color={growth >= 0 ? 'success.main' : 'error.main'}>
                    {fmtPercent(growth)}
                </Mui.Typography>
            </Mui.Stack>
        )}
    </Mui.Paper>
)

// ── Revenue Chart (Mở rộng chiều ngang cho Recharts) ───────────────────────────
const RevenueChart = ({ data, loading }) => {
    // Dùng hook này để lấy trực tiếp màu sắc từ theme hệ thống, tối ưu tương phản tự động
    const theme = Mui.useTheme();

    return (
        <Mui.Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Mui.Typography variant="subtitle1" fontWeight={800}>
                    Doanh thu 7 ngày gần nhất
                </Mui.Typography>
                <Mui.Typography variant="caption" sx={{ color: 'text.secondary', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                    Đơn vị: VNĐ
                </Mui.Typography>
            </Mui.Box>

            {loading ? (
                <Mui.Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2, flexGrow: 1 }} />
            ) : data.length === 0 ? (
                <Mui.Box sx={{ flexGrow: 1, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mui.Typography color="text.secondary" variant="body2">Chưa có dữ liệu doanh thu</Mui.Typography>
                </Mui.Box>
            ) : (
                <Mui.Box sx={{ width: '100%', height: 320, mt: 'auto' }}>
                    <ResponsiveContainer>
                        {/* Chuyển thành AreaChart để chơi được quả đổ màu gradient hoành tráng */}
                        <AreaChart data={data} margin={{ top: 10, right: 2, left: -20, bottom: 0 }}>
                            <defs>
                                {/* Định nghĩa dải màu chuyển sắc: Cam đậm ở đỉnh -> Trong suốt ở đáy */}
                                <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D85A30" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#D85A30" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>

                            {/* Đường lưới nét đứt dùng màu divider của hệ thống giúp nhìn rõ mà không bị chói */}
                            <CartesianGrid strokeDasharray="4 4" stroke={theme.palette.divider} vertical={false} />

                            <XAxis
                                dataKey="ngay"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                                stroke={theme.palette.text.secondary}
                                boundaryGap={false}
                            />

                            <YAxis
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={fmtCompact}
                                width={40}
                                stroke={theme.palette.text.secondary}
                            />

                            {/* Custom lại giao diện Tooltip hộp thoại nổi bật, viền sắc nét */}
                            <Tooltip
                                formatter={(v) => [fmt(v), "Doanh thu"]}
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    borderColor: theme.palette.divider,
                                    borderRadius: '8px',
                                    boxShadow: theme.shadows[4],
                                    color: theme.palette.text.primary
                                }}
                            />

                            {/* Vẽ đồ thị dạng vùng đổ màu kết hợp line dày nổi bật */}
                            <Area
                                type="monotone"
                                dataKey="doanhthu"
                                stroke="#D85A30"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorDoanhThu)" // Gọi Gradient đã định nghĩa ở trên
                                dot={{ r: 4, fill: '#D85A30', stroke: theme.palette.background.paper, strokeWidth: 1.5 }}
                                activeDot={{ r: 6, fill: '#D85A30', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Mui.Box>
            )}
        </Mui.Paper>
    );
};

// ── Top Products (Bố cục text hợp lý không lo xuống dòng xấu) ─────────────────
const TopProducts = ({ data, loading }) => (
    <Mui.Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Mui.Typography variant="subtitle1" fontWeight={800} mb={3}>
            Top sản phẩm bán chạy
        </Mui.Typography>

        <Mui.Box sx={{ flexGrow: 1, height: 320, overflowY: 'auto', pr: 0.5 }}>
            {loading ? (
                [...Array(5)].map((_, i) => <Mui.Skeleton key={i} height={52} sx={{ mb: 1, borderRadius: 1 }} />)
            ) : data.length === 0 ? (
                <Mui.Box display="flex" alignItems="center" justifyContent="center" height="100%">
                    <Mui.Typography color="text.secondary" variant="body2">Chưa có dữ liệu</Mui.Typography>
                </Mui.Box>
            ) : (
                <Mui.Stack spacing={2.5}> {/* Tăng khoảng cách giữa các hàng */}
                    {data.map((item, i) => (
                        <Mui.Box key={item.sanpham_id} display="flex" alignItems="flex-start" gap={2}>
                            <Mui.Typography variant="body2" fontWeight={800} color="text.disabled" sx={{ width: 16, pt: 0.2, textAlign: 'center', flexShrink: 0 }}>
                                {i + 1}
                            </Mui.Typography>
                            <Mui.Box flex={1} minWidth={0}>
                                {/* Bỏ noWrap để tên sản phẩm dài hiển thị đầy đủ, layout rộng sẽ gánh được hết */}
                                <Mui.Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.4 }}>
                                    {item.ten}
                                </Mui.Typography>
                                <Mui.Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                    Đã bán <span style={{ color: '#D85A30', fontWeight: 600 }}>{item.soLuongBan}</span>
                                </Mui.Typography>
                            </Mui.Box>
                        </Mui.Box>
                    ))}
                </Mui.Stack>
            )}
        </Mui.Box>
    </Mui.Paper>
)

// ── AdminDashboard (Bung toàn bộ chiều rộng nội dung) ──────────────────────
const AdminDashboard = () => {
    const { stats, growth, loading, revenueByDay, topProducts, statsLoading, refetch } = useAdminDashBoard()
    const theme = MuiStyles.useTheme()

    const STAT_CARDS = [
        { title: 'NGƯỜI DÙNG', key: 'users', icon: <Icon.PeopleOutlined fontSize="small" />, color: theme.palette.primary.main, path: '/admin/users' },
        { title: 'SẢN PHẨM', key: 'products', icon: <Icon.Inventory2Outlined fontSize="small" />, color: theme.palette.success.main, path: '/admin/products' },
        { title: 'ĐƠN HÀNG', key: 'orders', icon: <Icon.ShoppingCartOutlined fontSize="small" />, color: theme.palette.warning.main, path: '/admin/orders' },
        { title: 'DOANH THU', key: 'revenue', icon: <Icon.AttachMoneyOutlined fontSize="small" />, color: theme.palette.secondary.main, path: '/admin/orders' },
    ]

    return (
        // Xóa cứng maxWidth: 1400 để tận dụng 100% không gian màn hình bên phải Sidebar
        <Mui.Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Mui.Box mb={4} display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                <Mui.Box>
                    <Mui.Typography variant="h4" fontWeight={900} color="text.primary" letterSpacing="-0.5px">Tổng quan</Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary" mt={0.5}>
                        Chào mừng trở lại, hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Mui.Typography>
                </Mui.Box>
                <Mui.Button size="medium" variant="outlined" startIcon={<Icon.RefreshOutlined />} onClick={refetch} disabled={loading} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}>
                    Làm mới
                </Mui.Button>
            </Mui.Box>

            {/* Stat Cards Grid (Spacing 3 thoáng đãng) */}
            <Mui.Grid container spacing={3} mb={4}>
                {STAT_CARDS.map(({ key, ...card }) => (
                    <Mui.Grid item xs={6} sm={6} md={3} key={key}>
                        <StatCard
                            {...card}
                            value={key === 'revenue' ? fmt(stats[key] || 0) : stats[key]}
                            growth={growth[key]}
                            loading={loading}
                        />
                    </Mui.Grid>
                ))}
            </Mui.Grid>

            {/* Chỉnh lại tỷ lệ Grid thành 7 và 5 (Thay vì 8/4) để cân bằng thị giác hoàn hảo */}
            <Mui.Grid container spacing={3} alignItems="stretch">
                <Mui.Grid item xs={12} md={8.5}>
                    <RevenueChart data={revenueByDay} loading={statsLoading} />
                </Mui.Grid>
                <Mui.Grid item xs={12} md={3.5}>
                    <TopProducts data={topProducts} loading={statsLoading} />
                </Mui.Grid>
            </Mui.Grid>
        </Mui.Box>
    )
}

export default AdminDashboard