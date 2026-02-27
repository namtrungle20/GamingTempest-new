import { useState, useEffect } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import { Link } from 'react-router-dom';
import apiConfig from '@/config/apiConfig';

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
            '&:hover': { borderColor: color, transform: 'translateY(-2px)', boxShadow: 4 }
        }}
    >
        <Mui.Box>
            <Mui.Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={1}>
                {title}
            </Mui.Typography>
            {loading ? (
                <Mui.Skeleton width={60} height={40} />
            ) : (
                <Mui.Typography variant="h4" fontWeight={900} color="text.primary" mt={0.5}>
                    {value}
                </Mui.Typography>
            )}
        </Mui.Box>
        <Mui.Box sx={{
            width: 52, height: 52, borderRadius: 2,
            bgcolor: `${color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color
        }}>
            {icon}
        </Mui.Box>
    </Mui.Paper>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
    const [loading, setLoading] = useState(true);
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [usersRes, productsRes, ordersRes] = await Promise.all([
                    apiConfig.post('/nguoidung/danh-sach', {
                        filter: {}, pagination: { page: 1, perPage: 5 }, sort: { field: 'ngayvao', order: 'DESC' }
                    }),
                    apiConfig.get('/sanpham?action=all'),
                    apiConfig.get('/donhang'),
                ]);
                setStats({
                    users: usersRes.data.total || 0,
                    products: productsRes.data?.total || productsRes.data?.data?.length || 0,
                    orders: ordersRes.data?.total || ordersRes.data?.data?.length || 0,
                });
                setRecentUsers(usersRes.data.data || []);
            } catch {
                // Giữ giá trị mặc định nếu lỗi
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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
                <Mui.Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="NGƯỜI DÙNG"
                        value={stats.users}
                        icon={<Icon.PeopleOutlined />}
                        color="#ff8906"
                        path="/admin/users"
                        loading={loading}
                    />
                </Mui.Grid>
                <Mui.Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="SẢN PHẨM"
                        value={stats.products}
                        icon={<Icon.Inventory2Outlined />}
                        color="#4caf50"
                        path="/admin/products"
                        loading={loading}
                    />
                </Mui.Grid>
                <Mui.Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="ĐƠN HÀNG"
                        value={stats.orders}
                        icon={<Icon.ShoppingCartOutlined />}
                        color="#2196f3"
                        path="/admin/orders"
                        loading={loading}
                    />
                </Mui.Grid>
            </Mui.Grid>

            {/* Recent Users */}
            <Mui.Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <Mui.Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2} borderBottom="1px solid" borderColor="divider">
                    <Mui.Typography variant="subtitle1" fontWeight={900}>
                        Người dùng mới nhất
                    </Mui.Typography>
                    <Mui.Button
                        component={Link}
                        to="/admin/users"
                        size="small"
                        endIcon={<Icon.ArrowForward fontSize="small" />}
                        sx={{ fontWeight: 700 }}
                    >
                        Xem tất cả
                    </Mui.Button>
                </Mui.Box>

                {loading ? (
                    <Mui.Box p={3}>
                        {[...Array(5)].map((_, i) => (
                            <Mui.Skeleton key={i} height={52} sx={{ mb: 1 }} />
                        ))}
                    </Mui.Box>
                ) : recentUsers.length === 0 ? (
                    <Mui.Box p={4} textAlign="center">
                        <Mui.Typography color="text.secondary">Chưa có dữ liệu</Mui.Typography>
                    </Mui.Box>
                ) : (
                    <Mui.List disablePadding>
                        {recentUsers.map((user, index) => (
                            <Mui.ListItem
                                key={user.nguoidung_id}
                                divider={index < recentUsers.length - 1}
                                sx={{ px: 3, py: 1.5 }}
                            >
                                <Mui.ListItemAvatar>
                                    <Mui.Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                                        {user.email ? user.email[0].toUpperCase() : user.sdt?.[0]}
                                    </Mui.Avatar>
                                </Mui.ListItemAvatar>
                                <Mui.ListItemText
                                    primary={
                                        <Mui.Typography variant="body2" fontWeight={600}>
                                            {user.email || user.sdt}
                                        </Mui.Typography>
                                    }
                                    secondary={user.sdt || '—'}
                                />
                                <Mui.Chip
                                    label={user.vaitro === 1 ? 'Admin' : 'User'}
                                    size="small"
                                    sx={{
                                        bgcolor: user.vaitro === 1 ? 'primary.main' : 'action.selected',
                                        color: user.vaitro === 1 ? '#fff' : 'text.primary',
                                        fontWeight: 700,
                                        fontSize: '0.7rem'
                                    }}
                                />
                            </Mui.ListItem>
                        ))}
                    </Mui.List>
                )}
            </Mui.Paper>
        </Mui.Box>
    );
};

export default AdminDashboard;