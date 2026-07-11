import { useState, useEffect, useCallback } from 'react'
import apiConfig from '@/config/apiConfig'
import User from '@/models/User'
import { API } from '@/constants/apiConstants'
import { donHangService } from '@/services/donhang.service'

const useAdminDashBoard = () => {
    const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, revenue: 0 })
    const [growth, setGrowth] = useState({ users: null, products: null, orders: null, revenue: null })
    const [recentUsers, setRecentUsers] = useState([])
    const [revenueByDay, setRevenueByDay] = useState([])
    const [topProducts, setTopProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(true)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const notify = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity })

    const closeSnackbar = () =>
        setSnackbar(prev => ({ ...prev, open: false }))

    const fetchStats = useCallback(async () => {
        setLoading(true)
        setStatsLoading(true)
        try {
            const [userResponse, productResponse, orderResult, thongKeResult] = await Promise.allSettled([
                apiConfig.post(API.USERS.LIST, { page: 1, limit: 5, sort_by: 'ngayvao', sort_order: 'DESC' }),
                apiConfig.get(API.PRODUCTS.LIST),
                donHangService.getAll({ page: 1, limit: 1 }),
                donHangService.getThongKe(),
            ])

            const userData = userResponse.status === 'fulfilled' ? userResponse.value.data : null
            const productData = productResponse.status === 'fulfilled' ? productResponse.value.data : null

            const orderData = orderResult.status === 'fulfilled' && orderResult.value.success
                ? orderResult.value.raw
                : null
            const thongKeData = thongKeResult.status === 'fulfilled' && thongKeResult.value.success
                ? thongKeResult.value.raw?.data
                : null

            setStats({
                users: userData?.total || 0,
                products: productData?.total || productData?.data?.length || 0,
                orders: orderData?.total || 0,
                revenue: thongKeData?.tongTien || 0,
            })

            setGrowth({
                users: thongKeData?.tangTruongNguoiDung ?? null,
                products: thongKeData?.tangTruongSanPham ?? null,
                orders: thongKeData?.tangTruongDonHang ?? null,
                revenue: thongKeData?.tangTruongDoanhThu ?? null,
            })

            setRecentUsers((userData?.data || []).map(u => new User(u)))
            setRevenueByDay(thongKeData?.doanhThu7Ngay || [])
            setTopProducts(thongKeData?.topSanPham || [])

            const failedApi = userResponse.status === 'rejected' || productResponse.status === 'rejected'
            const failedService = orderResult.status === 'fulfilled' && !orderResult.value.success
                || thongKeResult.status === 'fulfilled' && !thongKeResult.value.success

            if (failedApi || failedService) {
                notify('Một số dữ liệu dashboard không tải được', 'warning')
            }
        } catch (err) {
            notify(err.response?.data?.message || 'Lỗi tải dữ liệu dashboard', 'error')
        } finally {
            setLoading(false)
            setStatsLoading(false)
        }
    }, [])

    useEffect(() => { fetchStats() }, [fetchStats])

    return {
        stats, growth, recentUsers, loading, statsLoading,
        revenueByDay, topProducts,
        snackbar, closeSnackbar,
        refetch: fetchStats
    }
}

export default useAdminDashBoard