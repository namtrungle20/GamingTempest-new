import * as Mui from '@mui/material'
import { UI_SETTING } from '@/theme/uiSetting'
import useHomePage from '@/hook/useHome'
import MainBanner from '@/components/sections/MainBanner'
import ProductShelf from '@/components/sections/ProductSheft'
import BrandBar from '@/components/sections/BrandBar'
import FeatureBanner from '@/components/sections/FeatureBanner'

const BANNER_IMAGES = [
    'https://file.hstatic.net/1000231532/collection/nintendo_switch_2_nshop_chinh_hang_cbf6a04687a84f3eadb6033a78ac825e.jpg',
    'https://cdn.hstatic.net/themes/1000231532/1001452980/14/slideshow_1.jpg?v=99',
    'https://cdn.hstatic.net/themes/1000231532/1001452980/14/slideshow_3.jpg?v=99',
]

const Section = ({ children }) => (
    <Mui.Container
        maxWidth={UI_SETTING.LAYOUT.CONTAINER_MAX_WIDTH}
        sx={{ px: UI_SETTING.LAYOUT.PAGE_PADDING_X }}
    >
        {children}
    </Mui.Container>
)

const ProductSkeleton = () => (
    <Mui.Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
        {[...Array(5)].map((_, i) => (
            <Mui.Box key={i} sx={{ minWidth: 220, flexShrink: 0 }}>
                <Mui.Skeleton variant="rectangular" height={165} sx={{ borderRadius: 2, mb: 1 }} />
                <Mui.Skeleton width="80%" height={20} sx={{ mb: 0.5 }} />
                <Mui.Skeleton width="50%" height={20} />
            </Mui.Box>
        ))}
    </Mui.Box>
)

const HomePage = () => {
    const { products, featuredProducts, loading } = useHomePage()

    return (
        <Mui.Box>
            {/* Banner */}
            <Section>
                <Mui.Box sx={{ mt: 2 }}>
                    <MainBanner payload={{ mainBanner: BANNER_IMAGES }} />
                </Mui.Box>
            </Section>

            {/* Feature strip */}
            <Section>
                <FeatureBanner />
            </Section>

            {/* Thương hiệu */}
            <Section>
                <BrandBar />
            </Section>

            {/* Sản phẩm nổi bật */}
            <Section>
                {loading ? (
                    <Mui.Box sx={{ py: 4 }}>
                        <Mui.Skeleton width={240} height={32} sx={{ mb: 3 }} />
                        <ProductSkeleton />
                    </Mui.Box>
                ) : featuredProducts.length > 0 && (
                    <ProductShelf
                        payload={{
                            title: '🔥 Sản phẩm nổi bật',
                            link: '/products',
                            items: featuredProducts.map(p => ({
                                id: p.id,
                                name: p.name,
                                price: p.gia,
                                image: p.imageUrl,
                            })),
                        }}
                    />
                )}
            </Section>

            {/* Tất cả sản phẩm */}
            <Section>
                {loading ? (
                    <Mui.Box sx={{ py: 4 }}>
                        <Mui.Skeleton width={280} height={32} sx={{ mb: 3 }} />
                        <ProductSkeleton />
                    </Mui.Box>
                ) : products.length > 0 && (
                    <ProductShelf
                        payload={{
                            title: '🛒 Tất cả sản phẩm',
                            link: '/products',
                            items: products.map(p => ({
                                id: p.id,
                                name: p.name,
                                price: p.gia,
                                image: p.imageUrl,
                            })),
                        }}
                    />
                )}
            </Section>

            {/* Bottom spacing */}
            <Mui.Box sx={{ pb: 6 }} />
        </Mui.Box>
    )
}

export default HomePage