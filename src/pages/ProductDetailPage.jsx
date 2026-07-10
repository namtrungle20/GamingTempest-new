import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import YouTube from 'react-youtube'
import { productService } from '@/services/product.service.js'
import Product from '@/models/Product'
import { UI_SETTING } from '@/theme/uiSetting'
import ProductInfoPanel from '@/components/product/ProductInfoPanel'
import ProductTabs from '@/components/product/ProductTabs'
import ProductDetailSkeleton from '@/components/product/ProductDetailSkeleton'
import { hinhAnhService } from '@/services/productImage.service'
import HinhAnh from '@/models/HinhAnh'
import { chitietsanphamService } from '@/services/chitietsanpham.service'
import useDanhGia from '@/hook/product/useDanhGia'

const getYoutubeId = (url) => {
    const match = url?.match(/embed\/([^?]+)/)
    return match ? match[1] : null
}

const ProductDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mediaList, setMediaList] = useState([])
    const [mainMedia, setMainMedia] = useState(null)
    const [chiTiets, setChiTiets] = useState([]);

    const danhGiaState = useDanhGia(id)

    const goToNext = useCallback(() => {
        setMainMedia(prev => {
            if (!prev || mediaList.length === 0) return prev
            const idx = mediaList.indexOf(prev)
            const nextIdx = idx === mediaList.length - 1 ? 0 : idx + 1
            return mediaList[nextIdx]
        })
    }, [mediaList])

    const goToPrev = useCallback(() => {
        setMainMedia(prev => {
            if (!prev || mediaList.length === 0) return prev
            const idx = mediaList.indexOf(prev)
            const prevIdx = idx === 0 ? mediaList.length - 1 : idx - 1
            return mediaList[prevIdx]
        })
    }, [mediaList])

    useEffect(() => {
        if (!id) return
        let cancelled = false
        chitietsanphamService.getAll(id).then(res => {
            if (!cancelled && res.success) setChiTiets(res.data || [])
        })
        return () => { cancelled = true }
    }, [id])


    // ✅ Auto-play ảnh — dừng khi đang là video
    useEffect(() => {
        if (mediaList.length <= 1) return
        if (mainMedia?.isVideo) return

        const timer = setTimeout(goToNext, 4000)
        return () => clearTimeout(timer)
    }, [mainMedia, mediaList, goToNext])

    useEffect(() => {
        if (!id) return
        hinhAnhService.getAll({ sanpham_id: id }).then(res => {
            if (res.success) {
                const items = (res.raw?.data || res.raw || [])
                    .map(h => new HinhAnh(h))
                    .filter(h => h.isValid)
                    .sort((a, b) => (b.isVideo === true) - (a.isVideo === true))
                setMediaList(items)
                if (items.length > 0) setMainMedia(items[0])
            }
        })
    }, [id])

    useEffect(() => {
        if (!id) return
        let cancelled = false
        const fetchProduct = async () => {
            setLoading(true)
            setError(null)
            const result = await productService.getById(id)
            if (cancelled) return
            if (result.success) {
                setProduct(new Product(result.raw.data || result.raw))
            } else {
                setError(result.message || 'Không tìm thấy sản phẩm')
            }
            setLoading(false)
        }
        fetchProduct()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return () => { cancelled = true }
    }, [id])

    if (loading) return (
        <Mui.Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Mui.Container maxWidth={false} sx={{ maxWidth: '1440px !important' }}>
                <Mui.Skeleton variant="text" width={220} height={24} sx={{ mb: 3 }} />
                <ProductDetailSkeleton />
            </Mui.Container>
        </Mui.Box>
    )

    if (error || !product) return (
        <Mui.Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mui.Stack alignItems="center" spacing={2} textAlign="center">
                <Mui.Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon.SearchOff sx={{ fontSize: 36, color: 'text.disabled' }} />
                </Mui.Box>
                <Mui.Typography variant="h6" fontWeight={800}>Không tìm thấy sản phẩm</Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" maxWidth={320}>
                    {error || 'Sản phẩm này có thể đã bị xóa hoặc không tồn tại.'}
                </Mui.Typography>
                <Mui.Button variant="contained" startIcon={<Icon.ArrowBack />} onClick={() => navigate('/products')} sx={{ fontWeight: 700, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS, textTransform: 'none', px: 4 }}>
                    Quay lại cửa hàng
                </Mui.Button>
            </Mui.Stack>
        </Mui.Box>
    )

    return (
        <Mui.Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Mui.Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
                {/* Breadcrumb */}
                <Mui.Breadcrumbs separator={<Icon.ChevronRight sx={{ fontSize: 16, color: 'text.disabled' }} />} sx={{ mb: 3 }}>
                    {[
                        { label: 'Trang chủ', icon: <Icon.Home sx={{ fontSize: 15 }} />, path: '/' },
                        { label: 'Sản phẩm', path: '/products' },
                    ].map(({ label, icon, path }) => (
                        <Mui.Link key={path} underline="hover" color="text.secondary" onClick={() => navigate(path)} sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 0.4 }}>
                            {icon}{label}
                        </Mui.Link>
                    ))}
                    <Mui.Typography color="text.primary" fontWeight={700} fontSize="0.82rem" noWrap sx={{ maxWidth: 260 }}>
                        {product.name}
                    </Mui.Typography>
                </Mui.Breadcrumbs>

                {/* Khung Layout chính chứa cả 2 phần */}
                <Mui.Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4, // Tăng khoảng cách giữa 2 cột cho thoáng
                    width: '100%',
                    alignItems: 'flex-start',
                }}>

                    <Mui.Box sx={{
                        flex: { md: '0 0 70%' },
                        width: { xs: '100%', md: '70%' },
                        position: 'relative',
                        paddingTop: { xs: '56.25%', md: '56.25%' },
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: '#0d0d0d',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}>
                        {mainMedia?.isVideo ? (
                            <YouTube
                                videoId={getYoutubeId(mainMedia.url)}
                                opts={{
                                    width: '100%',
                                    height: '100%',
                                    playerVars: { autoplay: 1, rel: 0 },
                                }}
                                onEnd={goToNext}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            />
                        ) : (
                            <img
                                src={mainMedia?.url || '/placeholder.jpg'}
                                alt={product.name}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        )}

                        {/* Nút điều hướng */}
                        {mediaList.length > 1 && (
                            <>
                                <Mui.IconButton
                                    onClick={goToPrev}
                                    sx={{
                                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                        width: 36, height: 36,
                                        bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                    }}
                                >
                                    <Icon.ChevronLeft />
                                </Mui.IconButton>
                                <Mui.IconButton
                                    onClick={goToNext}
                                    sx={{
                                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                        width: 36, height: 36,
                                        bgcolor: 'rgba(0,0,0,0.5)', color: 'white',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                                    }}
                                >
                                    <Icon.ChevronRight />
                                </Mui.IconButton>

                                {/* Số trang */}
                                <Mui.Box sx={{
                                    position: 'absolute', top: 12, right: 12,
                                    bgcolor: 'rgba(0,0,0,0.6)', color: 'white',
                                    fontSize: '0.75rem', px: 1.2, py: 0.4, borderRadius: 1, fontWeight: 600
                                }}>
                                    {mediaList.indexOf(mainMedia) + 1} / {mediaList.length}
                                </Mui.Box>

                                {/* Dots lướt ảnh */}
                                <Mui.Box sx={{
                                    position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
                                    display: 'flex', gap: 0.8,
                                }}>
                                    {mediaList.map((media, idx) => (
                                        <Mui.Box
                                            key={idx}
                                            onClick={() => setMainMedia(media)}
                                            sx={{
                                                width: mainMedia === media ? 18 : 6,
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: mainMedia === media ? 'white' : 'rgba(255,255,255,0.4)',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                            }}
                                        />
                                    ))}
                                </Mui.Box>
                            </>
                        )}
                    </Mui.Box>

                    {/* Cột phải — Panel thông tin sản phẩm */}
                    <Mui.Box sx={{
                        flex: 1,
                        minWidth: 0,
                        width: { xs: '100%', md: 'auto' },
                        boxSizing: 'border-box',
                    }}>
                        <ProductInfoPanel product={product} chiTiets={chiTiets} danhGiaState={danhGiaState} />
                    </Mui.Box>
                </Mui.Box>

                {/* Phần Tabs chi tiết ở dưới cùng */}
                <Mui.Box sx={{ mt: 5 }}>
                    <ProductTabs product={product} chiTiets={chiTiets} danhGiaState={danhGiaState} />
                </Mui.Box>

            </Mui.Container>
        </Mui.Box>
    )
}

export default ProductDetailPage