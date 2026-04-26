import { useState, useCallback, useEffect } from 'react'
import { donHangService } from '@/services/donhang.service'
import DonHang from '@/models/DonHang'
import { TRANG_THAI_DON_HANG, KHONG_THE_HUY } from '@/constants/donhangContants'

const useDonHang = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false)
    const [cancelling, setCancelling] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [filterTrangthai, setFilterTrangthai] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [openDetail, setOpenDetail] = useState(false)
    const [confirmCancel, setConfirmCancel] = useState({ open: false, id: null })
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const notify = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity })

    const closeSnackbar = () =>
        setSnackbar(prev => ({ ...prev, open: false }))

    const fetchOrders = useCallback(async () => {
        setLoading(true)
        try {
            const params = { page }
            if (filterTrangthai !== '') params.trangthai = filterTrangthai
            const res = await donHangService.getMyOrders(params)
            if (res.success) {
                setOrders(DonHang.fromList(res.raw.data || []))
                setTotalPages(res.raw.totalPages || 1)
                setTotal(res.raw.total || 0)
            } else {
                notify(res.message, 'error')
            }
        } catch {
            notify('Lỗi tải danh sách đơn hàng', 'error')
        } finally {
            setLoading(false)
        }
    }, [page, filterTrangthai])

    useEffect(() => { fetchOrders() }, [fetchOrders])

    const openCancelConfirm = (donhang_id) =>
        setConfirmCancel({ open: true, id: donhang_id })

    const closeCancelConfirm = () =>
        setConfirmCancel({ open: false, id: null })

    const cancelOrder = async () => {
        if (!confirmCancel.id) return
        setCancelling(true)
        try {
            const res = await donHangService.update(confirmCancel.id, {
                trangthai: TRANG_THAI_DON_HANG.DA_HUY
            })
            if (res.success) {
                setOrders(prev => prev.map(o =>
                    o.donhang_id === confirmCancel.id
                        ? new DonHang({ ...o, trangthai: TRANG_THAI_DON_HANG.DA_HUY })
                        : o
                ))
                notify('Hủy đơn hàng thành công')
            } else {
                notify(res.message, 'error')
            }
        } catch {
            notify('Lỗi hủy đơn hàng', 'error')
        } finally {
            setCancelling(false)
            closeCancelConfirm()
        }
    }

    const canCancel = (trangthai) => !KHONG_THE_HUY.includes(trangthai)

    const viewDetail = (order) => {
        setSelectedOrder(order)
        setOpenDetail(true)
    }

    const closeDetail = () => {
        setOpenDetail(false)
        setSelectedOrder(null)
    }

    return {
        orders, loading, cancelling,
        page, setPage,
        totalPages, total,
        filterTrangthai, setFilterTrangthai,
        selectedOrder, openDetail, viewDetail, closeDetail,
        confirmCancel, openCancelConfirm, closeCancelConfirm, cancelOrder,
        canCancel,
        snackbar, closeSnackbar,
        refetch: fetchOrders,
    }
}

export default useDonHang