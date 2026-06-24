import { useState, useEffect } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import DOMPurify from 'dompurify'
import { UI_SETTING } from '@/theme/uiSetting'
import { chitietsanphamService } from '@/services/chitietsanpham.service'
import { marked } from 'marked'
import useDanhGia from '@/hook/danhgia/useDanhGia'

const WARRANTY_ITEMS = [
    { icon: <Icon.Autorenew />, title: 'Đổi trả trong 7 ngày', desc: 'Sản phẩm lỗi do nhà sản xuất được đổi trả miễn phí trong 7 ngày.' },
    { icon: <Icon.VerifiedUser />, title: 'Bảo hành chính hãng', desc: 'Tất cả sản phẩm đều được bảo hành chính hãng theo quy định.' },
    { icon: <Icon.Support />, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.' },
]

// ── Rating Display ─────────────────────────────────────────────────────────
const RatingDisplay = ({ trungBinhSao, tongDanhGia, phanPhoiSao }) => (
    <Mui.Box sx={{
        display: 'flex', gap: 4, alignItems: 'center',
        p: 3, borderRadius: 2, bgcolor: 'action.hover', mb: 3, flexWrap: 'wrap',
    }}>
        <Mui.Box textAlign="center" sx={{ minWidth: 80 }}>
            <Mui.Typography variant="h2" fontWeight={900} color="primary.main" lineHeight={1}>
                {trungBinhSao.toFixed(1)}
            </Mui.Typography>
            <Mui.Rating value={trungBinhSao} precision={0.1} readOnly size="small" sx={{ mt: 0.5 }} />
            <Mui.Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                {tongDanhGia} đánh giá
            </Mui.Typography>
        </Mui.Box>
        <Mui.Box sx={{ flex: 1, minWidth: 200 }}>
            {[5, 4, 3, 2, 1].map(star => {
                const count = phanPhoiSao?.[star] || 0
                const percent = tongDanhGia > 0 ? (count / tongDanhGia) * 100 : 0
                return (
                    <Mui.Box key={star} display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Mui.Typography variant="caption" sx={{ minWidth: 8, fontWeight: 600 }}>{star}</Mui.Typography>
                        <Icon.Star sx={{ fontSize: 14, color: 'warning.main' }} />
                        <Mui.LinearProgress
                            variant="determinate" value={percent}
                            sx={{
                                flex: 1, height: 6, borderRadius: 3, bgcolor: 'divider',
                                '& .MuiLinearProgress-bar': { bgcolor: 'warning.main', borderRadius: 3 }
                            }}
                        />
                        <Mui.Typography variant="caption" color="text.secondary" sx={{ minWidth: 24 }}>
                            {count}
                        </Mui.Typography>
                    </Mui.Box>
                )
            })}
        </Mui.Box>
    </Mui.Box>
)

// ── Review Form ────────────────────────────────────────────────────────────
const ReviewForm = ({ onSubmit, submitting, submitError, setSubmitError }) => {
    const [sosao, setSosao] = useState(0)
    const [hoverSao, setHoverSao] = useState(-1)
    const [binhluan, setBinhluan] = useState('')

    const handleSubmit = async () => {
        const ok = await onSubmit({ sosao, binhluan })
        if (ok) { setSosao(0); setBinhluan('') }
    }

    return (
        <Mui.Box sx={{ mb: 3, p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Mui.Typography variant="subtitle2" fontWeight={800} mb={2}>
                Viết đánh giá của bạn
            </Mui.Typography>
            <Mui.Box display="flex" alignItems="center" gap={1} mb={2}>
                <Mui.Typography variant="body2" color="text.secondary">Đánh giá:</Mui.Typography>
                <Mui.Rating
                    value={sosao}
                    onChange={(_, val) => { setSosao(val); setSubmitError('') }}
                    onChangeActive={(_, val) => setHoverSao(val)}
                    onMouseLeave={() => setHoverSao(-1)}
                    size="large"
                />
                <Mui.Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                    {['', 'Tệ', 'Không tốt', 'Bình thường', 'Tốt', 'Xuất sắc'][hoverSao > 0 ? hoverSao : sosao]}
                </Mui.Typography>
            </Mui.Box>
            <Mui.TextField
                fullWidth multiline rows={3}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={binhluan}
                onChange={e => setBinhluan(e.target.value)}
                sx={{ mb: 1.5 }}
            />
            {submitError && (
                <Mui.Typography variant="caption" color="error" display="block" mb={1}>
                    {submitError}
                </Mui.Typography>
            )}
            <Mui.Button
                variant="contained" onClick={handleSubmit} disabled={submitting}
                startIcon={submitting ? <Mui.CircularProgress size={16} /> : <Icon.Send />}
                sx={{ fontWeight: 700, textTransform: 'none' }}
            >
                {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Mui.Button>
        </Mui.Box>
    )
}

// ── Review Item ────────────────────────────────────────────────────────────
const ReviewItem = ({ review, currentUserId, isAdmin, onDelete, deleting }) => {
    const isOwner = currentUserId && review.nguoidung?.id === currentUserId
    const canDelete = isOwner || isAdmin
    const isDeleting = deleting === review.danhgia_id

    return (
        <Mui.Box sx={{
            display: 'flex', gap: 2, py: 2.5,
            borderBottom: '1px solid', borderColor: 'divider',
            '&:last-child': { borderBottom: 'none' },
        }}>
            <Mui.Avatar src={review.nguoidung?.avatar} sx={{ width: 40, height: 40, flexShrink: 0 }}>
                {review.nguoidung?.name?.[0]?.toUpperCase()}
            </Mui.Avatar>
            <Mui.Box flex={1}>
                <Mui.Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                    <Mui.Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                        <Mui.Typography variant="subtitle2" fontWeight={700}>
                            {review.nguoidung?.name || 'Người dùng ẩn danh'}
                        </Mui.Typography>
                        <Mui.Rating value={review.sosao} readOnly size="small" />
                    </Mui.Box>
                    <Mui.Box display="flex" alignItems="center" gap={0.5}>
                        <Mui.Typography variant="caption" color="text.disabled">
                            {new Date(review.created_at).toLocaleDateString('vi-VN')}
                        </Mui.Typography>
                        {canDelete && (
                            <Mui.IconButton
                                size="small" color="error"
                                disabled={isDeleting}
                                onClick={() => onDelete(review.danhgia_id)}
                            >
                                {isDeleting
                                    ? <Mui.CircularProgress size={14} />
                                    : <Icon.DeleteOutlined sx={{ fontSize: 16 }} />
                                }
                            </Mui.IconButton>
                        )}
                    </Mui.Box>
                </Mui.Box>
                {review.binhluan && (
                    <Mui.Typography variant="body2" color="text.secondary" mt={0.75} sx={{ lineHeight: 1.7 }}>
                        {review.binhluan}
                    </Mui.Typography>
                )}
            </Mui.Box>
        </Mui.Box>
    )
}

// ── Review Section ─────────────────────────────────────────────────────────
const ReviewSection = ({ sanpham_id }) => {
    const {
        reviews, stats, loading, submitting, deleting,
        submitError, setSubmitError,
        currentUser, isLoggedIn, isAdmin, daReview,
        submitReview, deleteReview,
    } = useDanhGia(sanpham_id)

    return (
        <Mui.Box>
            <Mui.Typography variant="subtitle1" fontWeight={800} mb={2.5}>
                Đánh giá sản phẩm
            </Mui.Typography>

            {stats.tong_danh_gia > 0 && (
                <RatingDisplay
                    trungBinhSao={stats.trung_binh_sao}
                    tongDanhGia={stats.tong_danh_gia}
                    phanPhoiSao={stats.phan_phoi_sao}
                />
            )}

            {/* Form hoặc nút đăng nhập */}
            {isLoggedIn ? (
                daReview ? (
                    <Mui.Box sx={{
                        mb: 3, p: 2, borderRadius: 2,
                        bgcolor: 'action.hover', display: 'flex', alignItems: 'center', gap: 1,
                    }}>
                        <Icon.CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                        <Mui.Typography variant="body2" color="text.secondary">
                            Bạn đã đánh giá sản phẩm này rồi.
                        </Mui.Typography>
                    </Mui.Box>
                ) : (
                    <ReviewForm
                        onSubmit={submitReview}
                        submitting={submitting}
                        submitError={submitError}
                        setSubmitError={setSubmitError}
                    />
                )
            ) : (
                <Mui.Box sx={{
                    mb: 3, p: 2.5, textAlign: 'center',
                    border: '1px dashed', borderColor: 'divider', borderRadius: 2,
                }}>
                    <Mui.Typography variant="body2" color="text.secondary" mb={1.5}>
                        Đăng nhập để chia sẻ đánh giá của bạn
                    </Mui.Typography>
                    <Mui.Button
                        variant="outlined" href="/login"
                        startIcon={<Icon.Login />}
                        sx={{ fontWeight: 700, textTransform: 'none' }}
                    >
                        Đăng nhập để đánh giá
                    </Mui.Button>
                </Mui.Box>
            )}

            {/* Danh sách review */}
            {loading ? (
                <Mui.Stack spacing={2}>
                    {[...Array(3)].map((_, i) => (
                        <Mui.Box key={i} display="flex" gap={2}>
                            <Mui.Skeleton variant="circular" width={40} height={40} />
                            <Mui.Box flex={1}>
                                <Mui.Skeleton width="30%" height={20} />
                                <Mui.Skeleton width="100%" height={16} sx={{ mt: 1 }} />
                                <Mui.Skeleton width="80%" height={16} />
                            </Mui.Box>
                        </Mui.Box>
                    ))}
                </Mui.Stack>
            ) : reviews.length === 0 ? (
                <Mui.Box textAlign="center" py={4}>
                    <Icon.RateReview sx={{ fontSize: 40, color: 'text.disabled' }} />
                    <Mui.Typography variant="body2" color="text.disabled" mt={1}>
                        Chưa có đánh giá nào. Hãy là người đầu tiên!
                    </Mui.Typography>
                </Mui.Box>
            ) : (
                <Mui.Box>
                    {reviews.map(review => (
                        <ReviewItem
                            key={review.danhgia_id}
                            review={review}
                            currentUserId={currentUser?.nguoidung_id}
                            isAdmin={isAdmin}
                            deleting={deleting}
                            onDelete={deleteReview}
                        />
                    ))}
                </Mui.Box>
            )}
        </Mui.Box>
    )
}

// ── ProductTabs ────────────────────────────────────────────────────────────
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
                                        color: 'text.secondary', lineHeight: 1.85,
                                        '& h1, & h2, & h3, & h4': { color: 'text.primary', fontWeight: 800, mt: 2.5, mb: 1 },
                                        '& p': { mb: 1.5 },
                                        '& ul, & ol': { pl: 3, mb: 1.5 },
                                        '& li': { mb: 0.5 },
                                        '& img': { maxWidth: '100%', borderRadius: 2, my: 1.5, display: 'block' },
                                        '& strong': { color: 'text.primary', fontWeight: 700 },
                                        '& a': { color: 'primary.main' },
                                        '& blockquote': {
                                            borderLeft: '3px solid', borderColor: 'divider',
                                            pl: 2, ml: 0, color: 'text.disabled', fontStyle: 'italic',
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

                        <Mui.Divider />
                        <ReviewSection sanpham_id={product.id} />
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