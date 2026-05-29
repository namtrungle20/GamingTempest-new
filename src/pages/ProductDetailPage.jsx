import { useState, useEffect, useRef } from 'react'
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
import { hinhAnhService } from '@/services/productImage.service'
import HinhAnh from '@/models/HinhAnh'

const ProductDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [productImages, setProductImages] = useState([])

    const [mainImage, setMainImage] = useState(null)
    const [mainImageLoaded, setMainImageLoaded] = useState(false)

    const mainImageRef = useRef(null)
    const [panelHeight, setPanelHeight] = useState('auto')

    useEffect(() => {
        if (!id) return
        hinhAnhService.getAll({ sanpham_id: id }).then(res => {
            if (res.success) {
                const imgs = (res.raw?.data || res.raw || [])
                    .map(h => new HinhAnh(h))
                    .filter(h => h.isValid)
                    .map(h => h.url)
                setProductImages(imgs)
                if (imgs.length > 0) setMainImage(imgs[0])
            }
        })
    }, [id])

    useEffect(() => {
        setMainImageLoaded(false)
    }, [mainImage])

    const handleMainImageLoad = () => {
        setMainImageLoaded(true)
        // Đợi một frame để layout ổn định
        setTimeout(() => {
            if (mainImageRef.current) {
                setPanelHeight(`${mainImageRef.current.clientHeight}px`)
            }
        }, 50)
    }

    useEffect(() => {
        if (!mainImageLoaded) return
        if (mainImageRef.current) {
            const observer = new ResizeObserver(() => {
                if (mainImageRef.current) {
                    setPanelHeight(`${mainImageRef.current.clientHeight}px`)
                }
            })
            observer.observe(mainImageRef.current)
            return () => observer.disconnect()
        }
    }, [mainImageLoaded, mainImage])


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

    return (
        <Mui.Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
            <Mui.Container maxWidth={false} sx={{ maxWidth: '1600px', mx: 'auto', px: { xs: 2, md: 4 } }}>

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

                <Mui.Grid container spacing={3}>
                    <Mui.Grid item xs={12} md={4}>
                        {/* Ảnh lớn */}
                        <Mui.Box ref={mainImageRef} sx={{ width: '100%', mb: 2 }}>
                            <Mui.CardMedia
                                component="img"
                                image={mainImage || productImages[0] || '/placeholder.jpg'}
                                alt={product.name}
                                onLoad={handleMainImageLoad}
                                sx={{ width: '100%', objectFit: 'cover', borderRadius: 2 }}
                            />
                        </Mui.Box>
                        {/* Thumbnails */}
                        {productImages.length > 1 && (
                            <Mui.Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {productImages.map((img, idx) => (
                                    <Mui.Box
                                        key={idx}
                                        component="img"
                                        src={img}
                                        alt={`${product.name} ${idx + 1}`}
                                        onClick={() => setMainImage(img)}
                                        sx={{
                                            width: 70,
                                            height: 70,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            border: mainImage === img ? '2px solid' : '1px solid',
                                            borderColor: mainImage === img ? 'primary.main' : 'divider',
                                            opacity: mainImage === img ? 1 : 0.7,
                                            '&:hover': { opacity: 1, borderColor: 'primary.main' }
                                        }}
                                    />
                                ))}
                            </Mui.Box>
                        )}
                    </Mui.Grid>
                    <Mui.Grid item xs={12} md={8}>
                        <Mui.Box sx={{ height: panelHeight, overflowY: 'auto' }}>
                            <ProductInfoPanel product={product} />
                        </Mui.Box>
                    </Mui.Grid>
                </Mui.Grid>

                {/* Tabs */}
                <ProductTabs product={product} />

            </Mui.Container>
        </Mui.Box>
    )
}

export default ProductDetailPage