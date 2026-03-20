import { useState, useEffect, useCallback } from 'react'
import apiConfig from '@/config/apiConfig'
import User from '@/models/User'
import { API } from '@/constants/apiConstants'

const useAdminDashBoard = () => {
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 })
    const [recentUsers, setRecentUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const notify = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity })

    const closeSnackbar = () =>
        setSnackbar(prev => ({ ...prev, open: false }))

    const fetchStats = useCallback(async () => {
        setLoading(true)
        try {
            const [userResponse, productResponse] = await Promise.allSettled([
                apiConfig.post(API.USERS.LIST, { page: 1, limit: 5, sort_by: 'ngayvao', sort_order: 'DESC' }),
                apiConfig.get(API.PRODUCTS.LIST),
                // apiConfig.get(API.ORDERS.LIST),
            ])

            const userData = userResponse.status === 'fulfilled' ? userResponse.value.data : null
            const productData = productResponse.status === 'fulfilled' ? productResponse.value.data : null
            // const orderTotal = orderResponse.data?.total || orderResponse.data?.data?.length || 0

            const userTotal = userData?.total || 0
            const productTotal = productData?.total || productData?.data?.length || 0
            const latestUsers = (userData?.data || []).map(u => new User(u))

            setStats({ users: userTotal, products: productTotal, orders: 0 })
            setRecentUsers(latestUsers)
        } catch (err) {
            notify(err.response?.data?.message || 'Lỗi tải dữ liệu dashboard', 'error')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchStats() }, [fetchStats])

    return { stats, recentUsers, loading, snackbar, closeSnackbar, refetch: fetchStats }
}

export default useAdminDashBoard
