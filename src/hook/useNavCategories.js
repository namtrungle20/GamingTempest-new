import { useState, useEffect } from 'react'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

const useNavCategories = () => {
    const [navItems, setNavItems] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const [danhmucRes, loaiRes] = await Promise.all([
                    apiConfig.get(API.DANHMUC.LIST, { params: { limit: 100 } }),
                    apiConfig.get(API.CATEGORIES.LIST, { params: { limit: 100 } }),
                ])

                const danhMucs = danhmucRes.data.data || []
                const loaiSanPhams = loaiRes.data.data || []

                // Group loại sản phẩm theo danhmuc_id
                const grouped = danhMucs.map(dm => ({
                    label: dm.ten,
                    key: dm.url || `danhmuc-${dm.danhmuc_id}`,
                    items: loaiSanPhams
                        .filter(l => l.danhmuc_id === dm.danhmuc_id)
                        .map(l => ({
                            label: l.name,
                            to: `/products?loai=${l.loai_id}`
                        }))
                })).filter(dm => dm.items.length > 0) // bỏ danh mục không có loại

                setNavItems(grouped)
            } catch (err) {
                console.error('Lỗi load nav categories:', err)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    return { navItems, loading }
}

export default useNavCategories