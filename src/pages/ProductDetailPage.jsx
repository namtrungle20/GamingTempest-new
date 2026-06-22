import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { productService } from '@/services/product.service.js'
import Product from '@/models/Product'
import { UI_SETTING } from '@/theme/uiSetting'
import ProductInfoPanel from '@/components/product/ProductInfoPanel'
import ProductTabs from '@/components/product/ProductTabs'
import ProductDetailSkeleton from '@/components/product/ProductDetailSkeleton'
import { hinhAnhService } from '@/services/productImage.service'
import HinhAnh from '@/models/HinhAnh'

const ProductDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mediaList, setMediaList] = useState([])
    const [mainMedia, setMainMedia] = useState(null)

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
            <Mui.Container maxWidth={UI_SETTING.LAYOUT.CONTAINER_MAX_WIDTH}>
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

                {/* Layout 2 cột: flexbox thay Grid để tránh negative margin */}
                <Mui.Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    width: '100%',
                    alignItems: 'stretch',
                }}>
                    {/* Cột trái: ảnh/video – 70% */}
                    <Mui.Box sx={{
                        flex: '0 0 70%',
                        width: { xs: '100%', md: '70%' },
                        minWidth: 0,
                        boxSizing: 'border-box',
                    }}>
                        <Mui.Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {/* Main media – aspect ratio 4:3 */}
                            <Mui.Box sx={{
                                width: '100%',
                                position: 'relative',
                                paddingTop: '75%',
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}>
                                {mainMedia?.isVideo ? (
                                    <iframe
                                        src={mainMedia.url}
                                        title={product.name}
                                        allowFullScreen
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                    />
                                ) : (
                                    <img
                                        src={mainMedia?.url || '/placeholder.jpg'}
                                        alt={product.name}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                )}
                            </Mui.Box>

                            {/* Thumbnails */}
                            {mediaList.length > 1 && (
                                <Mui.Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {mediaList.map((media, idx) => (
                                        <Mui.Box
                                            key={idx}
                                            sx={{
                                                position: 'relative', width: 72, height: 72, flexShrink: 0,
                                                borderRadius: 2, overflow: 'hidden',
                                                border: '2px solid',
                                                borderColor: mainMedia === media ? 'primary.main' : 'divider',
                                                cursor: 'pointer',
                                                opacity: mainMedia === media ? 1 : 0.65,
                                                transition: 'all 0.18s ease',
                                                '&:hover': { opacity: 1, borderColor: 'primary.light' },
                                            }}
                                            onClick={() => setMainMedia(media)}
                                        >
                                            <img
                                                src={media.thumbnail}
                                                alt={`${product.name} ${idx + 1}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                            {media.isVideo && (
                                                <Mui.Box sx={{
                                                    position: 'absolute', inset: 0,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <Icon.PlayCircleFilled sx={{ color: 'white', fontSize: 26, filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))' }} />
                                                </Mui.Box>
                                            )}
                                        </Mui.Box>
                                    ))}
                                </Mui.Box>
                            )}
                        </Mui.Box>
                    </Mui.Box>

                    {/* Cột phải: panel thông tin – phần còn lại */}
                    <Mui.Box sx={{
                        flex: 1,
                        minWidth: 0,
                        width: { xs: '100%', md: 'auto' },
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <ProductInfoPanel product={product} />
                    </Mui.Box>
                </Mui.Box>

                <Mui.Box sx={{ mt: 4 }}>
                    <ProductTabs product={product} />
                </Mui.Box>
            </Mui.Container>
        </Mui.Box>
    )
}

export default ProductDetailPage