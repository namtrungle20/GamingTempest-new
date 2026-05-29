import { useState, useEffect, useCallback } from 'react'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'
import Product from '@/models/Product'

const useHomePage = () => {
    const [products, setProducts] = useState([])
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const res = await apiConfig.get(API.PRODUCTS.LIST, { params: { limit: 20 } })
            const all = (res.data?.data || []).map(p => new Product(p))
            setProducts(all)
            // Lấy 6 sản phẩm đầu làm featured
            setFeaturedProducts(all.slice(0, 6))
        } catch {
            // silent fail
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    return { products, featuredProducts, loading }
}

export default useHomePage