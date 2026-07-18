// components/sections/Footer.jsx
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
    {
        title: 'Về chúng tôi',
        links: [
            { label: 'Giới thiệu', to: '/about' },
            { label: 'Liên hệ', to: '/contact' },
            { label: 'Tuyển dụng', to: '/careers' },
        ],
    },
    {
        title: 'Chính sách',
        links: [
            { label: 'Hạng thành viên', to: '/policy/rank' },
            { label: 'Bảo hành', to: '/policy/warranty' },
            { label: 'Đổi hàng', to: '/policy/exchange' },
        ],
    },
    {
        title: 'Hỗ trợ khách hàng',
        links: [
            { label: 'Câu hỏi thường gặp', to: '/faq' },
            { label: 'Tra cứu đơn hàng', to: '/donhang' },
            { label: 'Hướng dẫn mua hàng', to: '/guide' },
        ],
    },
]

const SOCIAL_LINKS = [
    { icon: <Icon.Facebook />, href: 'https://facebook.com/yourpage' },
    { icon: <Icon.Instagram />, href: 'https://instagram.com/yourpage' },
    { icon: <Icon.YouTube />, href: 'https://youtube.com/yourchannel' },
]

const PAYMENT_METHODS = ['MoMo', 'COD']

const Footer = () => (
    <Mui.Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', mt: 8 }}>
        <Mui.Container maxWidth="lg" sx={{ py: 6 }}>
            <Mui.Grid container spacing={4}>
                {/* Thông tin thương hiệu */}
                <Mui.Grid item xs={12} md={4}>
                    <Mui.Typography variant="h6" fontWeight={900} color="primary.main" gutterBottom>
                        TEMPESTGAMING
                    </Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 320 }}>
                        Chuyên cung cấp thiết bị chơi game chính hãng, giá tốt, giao hàng toàn quốc.
                    </Mui.Typography>

                    <Mui.Stack spacing={1}>
                        <Mui.Stack direction="row" alignItems="center" gap={1}>
                            <Icon.LocationOn fontSize="small" color="action" />
                            <Mui.Typography variant="body2" color="text.secondary">
                                180 Cao Lỗ, Phường 4, Quận 8, TP.HCM
                            </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack direction="row" alignItems="center" gap={1}>
                            <Icon.Phone fontSize="small" color="action" />
                            <Mui.Typography variant="body2" color="text.secondary">
                                0398 907 971
                            </Mui.Typography>
                        </Mui.Stack>
                        <Mui.Stack direction="row" alignItems="center" gap={1}>
                            <Icon.Email fontSize="small" color="action" />
                            <Mui.Typography variant="body2" color="text.secondary">
                                support@consolegs.vn
                            </Mui.Typography>
                        </Mui.Stack>
                    </Mui.Stack>

                    <Mui.Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        {SOCIAL_LINKS.map((s, i) => (
                            <Mui.IconButton
                                key={i}
                                component="a"
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="small"
                                sx={{ border: '1px solid', borderColor: 'divider' }}
                            >
                                {s.icon}
                            </Mui.IconButton>
                        ))}
                    </Mui.Stack>
                </Mui.Grid>

                {/* Các cột link */}
                {FOOTER_LINKS.map((group) => (
                    <Mui.Grid item xs={6} md={2.5} key={group.title}>
                        <Mui.Typography variant="subtitle2" fontWeight={800} gutterBottom>
                            {group.title}
                        </Mui.Typography>
                        <Mui.Stack spacing={1}>
                            {group.links.map((l) => (
                                <Mui.Link
                                    key={l.to}
                                    component={Link}
                                    to={l.to}
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
                                >
                                    {l.label}
                                </Mui.Link>
                            ))}
                        </Mui.Stack>
                    </Mui.Grid>
                ))}
            </Mui.Grid>

            <Mui.Divider sx={{ my: 4 }} />

            {/* Phương thức thanh toán + bản quyền */}
            <Mui.Box sx={{
                display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', alignItems: 'center', gap: 2,
            }}>
                <Mui.Typography variant="caption" color="text.secondary">
                    © 2026 TEMPESTGAMING .
                </Mui.Typography>

                <Mui.Stack direction="row" spacing={1}>
                    {PAYMENT_METHODS.map((p) => (
                        <Mui.Chip key={p} label={p} size="small" variant="outlined" sx={{ fontSize: 11 }} />
                    ))}
                </Mui.Stack>
            </Mui.Box>
        </Mui.Container>
    </Mui.Box>
)

export default Footer