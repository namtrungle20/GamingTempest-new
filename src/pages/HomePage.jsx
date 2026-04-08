import { useState, useEffect, useCallback } from 'react'
import PageBuilder from '@/layout/PageBuilder'
import { PRODUCT_DATA } from '@/constants/productData'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'
import Product from '@/models/Product'

const STATIC_BLOCKS = [
    { type: 'NAVBAR', payload: {} },
    {
        type: 'MAIN_BANNER',
        payload: {
            mainBanner: [
                'https://file.hstatic.net/1000231532/collection/nintendo_switch_2_nshop_chinh_hang_cbf6a04687a84f3eadb6033a78ac825e.jpg',
                'https://cdn.hstatic.net/themes/1000231532/1001452980/14/slideshow_1.jpg?v=99',
                'https://cdn.hstatic.net/themes/1000231532/1001452980/14/slideshow_3.jpg?v=99',
            ],
        },
    },
    // {
    //     type: 'PRODUCT_SHELF',
    //     payload: {
    //         title: '🔥 Hàng mới cập bến',
    //         limit: 6,
    //         items: PRODUCT_DATA.NEW_ARRIVALS,
    //     },
    // },
    // {
    //     type: 'PRODUCT_SHELF',
    //     payload: {
    //         title: '❤️ Sản phẩm được yêu thích nhất',
    //         items: PRODUCT_DATA.FAVORITES,
    //     },
    // },
]

const HomePage = () => {
    const [dbProducts, setDbProducts] = useState([])

    const fetchProducts = useCallback(async () => {
        try {
            const res = await apiConfig.get(API.PRODUCTS.LIST)
            const products = (res.data?.data || []).map(p => new Product(p))
            setDbProducts(products)
        } catch (err) {
            return {success: true, message: "Không có sản phẩm"}
        }
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    const pageConfig = [
        ...STATIC_BLOCKS,
        ...(dbProducts.length > 0 ? [{
            type: 'PRODUCT_SHELF',
            payload: {
                title: '🛒 Sản phẩm trong cửa hàng',
                items: dbProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.gia,       // ✅ số nguyên để ProductCard format
                    image: p.imageUrl,  // ✅ dùng getter
                })),
            },
        }] : []),
    ]

    return <PageBuilder pageConfig={pageConfig} />
}

export default HomePage