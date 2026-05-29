import { useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'

const WARRANTY_ITEMS = [
    { icon: <Icon.Autorenew />, title: 'Đổi trả trong 7 ngày', desc: 'Sản phẩm lỗi do nhà sản xuất được đổi trả miễn phí trong 7 ngày.' },
    { icon: <Icon.VerifiedUser />, title: 'Bảo hành chính hãng', desc: 'Tất cả sản phẩm đều được bảo hành chính hãng theo quy định.' },
    { icon: <Icon.Support />, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.' },
]

const ProductTabs = ({ product }) => {
    const [tab, setTab] = useState(0)

    // Tách mô tả thành các đoạn văn theo \n\n
    const motaParagraphs = (product.mota || '')
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(Boolean)

    return (
        <Mui.Paper elevation={0} sx={{
            mt: 3, borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
            border: '1px solid', borderColor: 'divider', overflow: 'hidden',
        }}>
            <Mui.Tabs
                value={tab} onChange={(_, v) => setTab(v)}
                sx={{
                    borderBottom: '1px solid', borderColor: 'divider',
                    px: { xs: 2, md: 3 },
                    '& .MuiTab-root': {
                        fontWeight: 700, textTransform: 'none',
                        fontSize: '0.875rem', minHeight: 48,
                    },
                }}
            >
                <Mui.Tab label="Mô tả sản phẩm" icon={<Icon.Description sx={{ fontSize: 17 }} />} iconPosition="start" />
                <Mui.Tab label="Chính sách bảo hành" icon={<Icon.VerifiedUser sx={{ fontSize: 17 }} />} iconPosition="start" />
            </Mui.Tabs>

            <Mui.Box sx={{ p: { xs: 3, md: 4 }, minHeight: 160 }}>
                {tab === 0 && (
                    motaParagraphs.length > 0 ? (
                        <Mui.Stack spacing={2}>
                            {motaParagraphs.map((para, i) => (
                                <Mui.Typography
                                    key={i}
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ lineHeight: 1.85, whiteSpace: 'pre-line' }}
                                >
                                    {para}
                                </Mui.Typography>
                            ))}
                        </Mui.Stack>
                    ) : (
                        <Mui.Box display="flex" flexDirection="column" alignItems="center"
                            justifyContent="center" py={4} gap={1}>
                            <Icon.InfoOutlined sx={{ fontSize: 36, color: 'text.disabled' }} />
                            <Mui.Typography variant="body2" color="text.disabled">
                                Mô tả sản phẩm đang được cập nhật.
                            </Mui.Typography>
                        </Mui.Box>
                    )
                )}

                {tab === 1 && (
                    <Mui.Stack spacing={2.5}>
                        {WARRANTY_ITEMS.map((item, i) => (
                            <Mui.Box key={i} display="flex" gap={2} alignItems="flex-start">
                                <Mui.Box sx={{
                                    color: 'primary.main', mt: 0.3,
                                    width: 36, height: 36, borderRadius: 1.5,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    bgcolor: theme => theme.palette.mode === 'dark'
                                        ? 'rgba(255,137,6,0.12)' : 'rgba(255,137,6,0.08)',
                                }}>
                                    {item.icon}
                                </Mui.Box>
                                <Mui.Box>
                                    <Mui.Typography variant="subtitle2" fontWeight={800}>{item.title}</Mui.Typography>
                                    <Mui.Typography variant="body2" color="text.secondary" mt={0.25}>{item.desc}</Mui.Typography>
                                </Mui.Box>
                            </Mui.Box>
                        ))}
                    </Mui.Stack>
                )}
            </Mui.Box>
        </Mui.Paper>
    )
}

export default ProductTabs