import { useState, useEffect } from 'react'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

const useNavCategories = () => {
    const [navItems, setNavItems] = useState([])
    const [loading, setLoading] = useState(true) // ✅ true ngay từ đầu, tránh flash

    useEffect(() => {
        const controller = new AbortController() // ✅ cleanup khi unmount

        const fetchNav = async () => {
            try {
                const [danhmucRes, loaiRes] = await Promise.all([
                    apiConfig.get(API.DANHMUC.LIST, { params: { limit: 100 }, signal: controller.signal }),
                    apiConfig.get(API.CATEGORIES.LIST, { params: { limit: 100 }, signal: controller.signal }),
                ])

                const danhMucs = danhmucRes.data.data || []
                const loaiSanPhams = loaiRes.data.data || []

                // ✅ sort theo thutu nếu API có field đó
                const sorted = [...danhMucs].sort((a, b) => a.thutu - b.thutu)

                const grouped = sorted.map(dm => ({
                    label: dm.ten,
                    key: dm.url || `danhmuc-${dm.danhmuc_id}`,
                    items: loaiSanPhams
                        .filter(l => l.danhmuc_id === dm.danhmuc_id)
                        .map(l => ({
                            label: l.name,
                            to: `/products?loai=${l.loai_id}`
                        }))
                })).filter(dm => dm.items.length > 0)

                setNavItems(grouped)
            } catch (err) {
                if (err.name !== 'CanceledError') { // ✅ bỏ qua lỗi do unmount
                    console.error('Lỗi load nav categories:', err)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchNav()

        return () => controller.abort() // ✅ cleanup
    }, [])

    return { navItems, loading }
}

export default useNavCategories