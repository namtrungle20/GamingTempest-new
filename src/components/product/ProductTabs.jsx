import { useState, useEffect } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import DOMPurify from 'dompurify'
import { UI_SETTING } from '@/theme/uiSetting'
import { chitietsanphamService } from '@/services/chitietsanpham.service'
import { marked } from 'marked'

const WARRANTY_ITEMS = [
    { icon: <Icon.Autorenew />, title: 'Đổi trả trong 7 ngày', desc: 'Sản phẩm lỗi do nhà sản xuất được đổi trả miễn phí trong 7 ngày.' },
    { icon: <Icon.VerifiedUser />, title: 'Bảo hành chính hãng', desc: 'Tất cả sản phẩm đều được bảo hành chính hãng theo quy định.' },
    { icon: <Icon.Support />, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.' },
]

const ProductTabs = ({ product }) => {
    const [tab, setTab] = useState(0)
    const [chiTiets, setChiTiets] = useState([])

    useEffect(() => {
        if (!product?.id) return
        let cancelled = false
        chitietsanphamService.getAll(product.id).then(res => {
            if (!cancelled && res.success) setChiTiets(res.data || [])
        })
        return () => { cancelled = true }
    }, [product?.id])

    useEffect(() => { setTab(0) }, [product?.id])

    // const motaParagraphs = (product.mota || '')
    //     .split(/\n\n+/)
    //     .map(p => p.trim())
    //     .filter(Boolean)

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

                {/* Tab 0 — Thông số kỹ thuật (nếu có) + Mô tả */}
                {tab === 0 && (
                    <Mui.Stack spacing={3}>
                        {chiTiets.length > 0 && (
                            <Mui.Box>
                                <Mui.Typography variant="subtitle1" fontWeight={800} mb={1.5}>
                                    Thông số kỹ thuật
                                </Mui.Typography>
                                <Mui.Table size="small">
                                    <Mui.TableBody>
                                        {chiTiets.map((ct, i) => (
                                            <Mui.TableRow key={ct.id} sx={{
                                                bgcolor: i % 2 === 0 ? 'action.hover' : 'transparent',
                                                '&:last-child td': { border: 0 }
                                            }}>
                                                <Mui.TableCell sx={{ fontWeight: 700, width: '35%', color: 'text.secondary', border: 0 }}>
                                                    {ct.name}
                                                </Mui.TableCell>
                                                <Mui.TableCell sx={{ fontWeight: 500, border: 0 }}>
                                                    {ct.gia_tri}
                                                </Mui.TableCell>
                                            </Mui.TableRow>
                                        ))}
                                    </Mui.TableBody>
                                </Mui.Table>
                            </Mui.Box>
                        )}

                        <Mui.Box>
                            {chiTiets.length > 0 && (
                                <Mui.Typography variant="subtitle1" fontWeight={800} mb={1.5}>
                                    Mô tả sản phẩm
                                </Mui.Typography>
                            )}
                            {product.mota ? (
                                <Mui.Box
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(marked.parse(product.mota), {
                                            ADD_TAGS: ['img'],
                                            ADD_ATTR: ['src', 'alt', 'width', 'height', 'loading', 'style'],
                                        })
                                    }}
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.85,
                                        '& h1, & h2, & h3, & h4': {
                                            color: 'text.primary',
                                            fontWeight: 800,
                                            mt: 2.5, mb: 1,
                                        },
                                        '& p': { mb: 1.5 },
                                        '& ul, & ol': { pl: 3, mb: 1.5 },
                                        '& li': { mb: 0.5 },
                                        '& img': {
                                            maxWidth: '100%',
                                            borderRadius: 2,
                                            my: 1.5,
                                            display: 'block',
                                        },
                                        '& strong': { color: 'text.primary', fontWeight: 700 },
                                        '& a': { color: 'primary.main' },
                                        '& blockquote': {
                                            borderLeft: '3px solid',
                                            borderColor: 'divider',
                                            pl: 2, ml: 0,
                                            color: 'text.disabled',
                                            fontStyle: 'italic',
                                        },
                                    }}
                                />
                            ) : (
                                <Mui.Box display="flex" flexDirection="column" alignItems="center"
                                    justifyContent="center" py={4} gap={1}>
                                    <Icon.InfoOutlined sx={{ fontSize: 36, color: 'text.disabled' }} />
                                    <Mui.Typography variant="body2" color="text.disabled">
                                        Mô tả sản phẩm đang được cập nhật.
                                    </Mui.Typography>
                                </Mui.Box>
                            )}
                        </Mui.Box>
                    </Mui.Stack>
                )}

                {/* Tab 1 — Bảo hành */}
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