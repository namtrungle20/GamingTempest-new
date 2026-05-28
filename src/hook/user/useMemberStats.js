import { useState, useEffect } from 'react'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'
import DonHang from '@/models/DonHang'

const useMemberStats = () => {
    const [totalSpent, setTotalSpent] = useState(0)
    const [orderCount, setOrderCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await apiConfig.get(API.ORDERS.MY_LIST, { params: { limit: 1000 } })
                const orders = DonHang.fromList(res.data.data || [])
                setTotalSpent(orders.reduce((sum, o) => sum + o.tongtien, 0))
                setOrderCount(res.data.total || orders.length)
            } catch {
                // silent fail — stats không quan trọng bằng page chính
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    return { totalSpent, orderCount, loading }
}

export default useMemberStats