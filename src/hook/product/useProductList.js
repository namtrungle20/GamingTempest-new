import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService } from '@/services/product.service.js'
import Product from '@/models/Product'
import { debounce } from '@mui/material'

const useProductList = () => {
    const [searchParams] = useSearchParams()

    const [products, setProducts] = useState([])
    const [brands, setBrands] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')


    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        loai_id: searchParams.get('loai') || '',
        thuonghieu_id: searchParams.get('thuonghieu') || '',
        gia_min: '',
        gia_max: '',
        sort_by: 'createdAt',
        sort_order: 'DESC',
    })

    useEffect(() => {
        const loai = searchParams.get('loai') || ''
        const thuonghieu = searchParams.get('thuonghieu') || ''
        const search = searchParams.get('search') || ''

        setFilters(prev => ({
            ...prev,
            loai_id: loai,
            thuonghieu_id: thuonghieu,
            search,
        }))
        setSearchInput(search)
        setPage(1)
    }, [searchParams])

    const debounceRef = useRef(null)
    useEffect(() => {
        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            const trimmed = searchInput.trim()
            console.log('🔵 debounce fired:', trimmed, 'length:', trimmed.length)
            if (trimmed.length >= 2 || trimmed.length === 0) {
                console.log('🔵 updating filter search:', trimmed)
                setFilters(prev => ({ ...prev, search: trimmed }))
                setPage(1)
            }
        }, 400)
        return () => clearTimeout(debounceRef.current)
    }, [searchInput])

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        const params = { page, limit: 12, ...filters }
        // bỏ key rỗng
        Object.keys(params).forEach(k => params[k] === '' && delete params[k])

        const result = await productService.getAll(params)
        if (result.success) {
            setProducts((result.raw.data || []).map(p => new Product(p)))
            setTotal(result.raw.total || 0)
        }
        setLoading(false)
    }, [page, filters])

    const fetchMeta = useCallback(async () => {
        const [brandResult, categoryResult] = await Promise.allSettled([
            productService.getBrands(),
            productService.getCategories(),
        ])
        if (brandResult.status === 'fulfilled' && brandResult.value.success)
            setBrands(brandResult.value.raw.data || [])
        if (categoryResult.status === 'fulfilled' && categoryResult.value.success)
            setCategories(categoryResult.value.raw.data || [])
    }, [])

    useEffect(() => { fetchProducts() }, [fetchProducts])
    useEffect(() => { fetchMeta() }, [fetchMeta])

    const updateFilter = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPage(1)
    }, [])

    const resetFilters = useCallback(() => {
        setFilters({
            search: '',
            loai_id: '',
            thuonghieu_id: '',
            gia_min: '',
            gia_max: '',
            sort_by: 'createdAt',
            sort_order: 'DESC',
        })
        setPage(1)
    }, [])

    return {
        products, brands, categories,
        loading, total, page, filters,
        searchInput, setSearchInput,
        setPage, updateFilter, resetFilters,

    }
}

export default useProductList