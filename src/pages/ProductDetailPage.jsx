import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { productService } from '@/services/product.service.js'
import Product from '@/models/Product'
import { UI_SETTING } from '@/theme/uiSetting'
import ImageGallery from '@/components/product/ImageGallery'
import ProductInfoPanel from '@/components/product/ProductInfoPanel'
import ProductTabs from '@/components/product/ProductTabs'
import ProductDetailSkeleton from '@/components/product/ProductDetailSkeleton'

const ProductDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    // ── Loading ───────────────────────────────────────────────────────────
    if (loading) return (
        <Mui.Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Mui.Container maxWidth={UI_SETTING.LAYOUT.CONTAINER_MAX_WIDTH}>
                <Mui.Skeleton variant="text" width={220} height={24} sx={{ mb: 3 }} />
                <ProductDetailSkeleton />
            </Mui.Container>
        </Mui.Box>
    )

    // ── Error ─────────────────────────────────────────────────────────────
    if (error || !product) return (
        <Mui.Box sx={{
            bgcolor: 'background.default', minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <Mui.Stack alignItems="center" spacing={2} textAlign="center">
                <Mui.Box sx={{
                    width: 80, height: 80, borderRadius: '50%',
                    bgcolor: 'action.hover', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon.SearchOff sx={{ fontSize: 36, color: 'text.disabled' }} />
                </Mui.Box>
                <Mui.Typography variant="h6" fontWeight={800}>Không tìm thấy sản phẩm</Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" maxWidth={320}>
                    {error || 'Sản phẩm này có thể đã bị xóa hoặc không tồn tại.'}
                </Mui.Typography>
                <Mui.Button
                    variant="contained" startIcon={<Icon.ArrowBack />}
                    onClick={() => navigate('/products')}
                    sx={{ fontWeight: 700, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS, textTransform: 'none', px: 4 }}
                >
                    Quay lại cửa hàng
                </Mui.Button>
            </Mui.Stack>
        </Mui.Box>
    )

    const productImages = product.imageUrl ? [product.imageUrl] : []

    // ── Render ────────────────────────────────────────────────────────────
    return (
        <Mui.Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Mui.Container maxWidth={UI_SETTING.LAYOUT.CONTAINER_MAX_WIDTH}>

                {/* Breadcrumb */}
                <Mui.Breadcrumbs
                    separator={<Icon.ChevronRight sx={{ fontSize: 16, color: 'text.disabled' }} />}
                    sx={{ mb: 3 }}
                >
                    {[
                        { label: 'Trang chủ', icon: <Icon.Home sx={{ fontSize: 15 }} />, path: '/' },
                        { label: 'Sản phẩm', path: '/products' },
                    ].map(({ label, icon, path }) => (
                        <Mui.Link
                            key={path} underline="hover" color="text.secondary"
                            onClick={() => navigate(path)}
                            sx={{ cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 0.4 }}
                        >
                            {icon}{label}
                        </Mui.Link>
                    ))}
                    <Mui.Typography color="text.primary" fontWeight={700} fontSize="0.82rem" noWrap sx={{ maxWidth: 260 }}>
                        {product.name}
                    </Mui.Typography>
                </Mui.Breadcrumbs>

                {/* Main grid */}
                <Mui.Grid container spacing={3} alignItems="flex-start">
                    <Mui.Grid item xs={12} md={7}>
                        <ImageGallery images={productImages} productName={product.name} />
                    </Mui.Grid>
                    <Mui.Grid item xs={12} md={5}>
                        <ProductInfoPanel product={product} />
                    </Mui.Grid>
                </Mui.Grid>

                {/* Tabs */}
                <ProductTabs product={product} />

            </Mui.Container>
        </Mui.Box>
    )
}

export default ProductDetailPage