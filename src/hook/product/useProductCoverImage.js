// src/hook/useProductCoverImage.js
import { useState, useEffect } from 'react'
import { hinhAnhService } from '@/services/productImage.service'
import HinhAnh from '@/models/HinhAnh'

export const useProductCoverImage = (productId) => {
    const [coverUrl, setCoverUrl] = useState(null)

    useEffect(() => {
        if (!productId) return
        hinhAnhService.getAll({ sanpham_id: productId }).then(res => {
            if (!res.success) return
            const list = (res.raw?.data || res.raw || []).map(h => new HinhAnh(h))
            const cover = list.find(h => h.is_primary && h.isValid)
                || list.find(h => h.isValid)
            setCoverUrl(cover?.url || null)
        })
    }, [productId])

    return coverUrl
}
