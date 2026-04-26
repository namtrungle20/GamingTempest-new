// hook/admin/useDonHang.js
import { useState, useCallback, useEffect } from 'react'
import { donHangService } from '@/services/donhang.service'
import DonHang from '@/models/DonHang'
import { TRANG_THAI_DON_HANG } from '@/constants/donhangContants'

const useDonHangManager = () => {
    const [orders, setOrders] = useState([])   // DonHangModel[]
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [filterTrangthai, setFilterTrangthai] = useState('')

    const fetchOrders = useCallback(async () => {
        setLoading(true)
        const params = { page }
        if (filterTrangthai !== '') params.trangthai = filterTrangthai
        const res = await donHangService.getAll(params)
        if (res.success) {
            setOrders(DonHang.fromList(res.raw.data || []))
            setTotalPages(res.raw.totalPages || 1)
            setTotal(res.raw.total || 0)
        }
        setLoading(false)
    }, [page, filterTrangthai])

    useEffect(() => { fetchOrders() }, [fetchOrders])

    const updateTrangthai = async (donhang_id, trangthai) => {
        setUpdating(true)
        const res = await donHangService.update(donhang_id, { trangthai })
        if (res.success) {
            setOrders(prev => prev.map(o =>
                o.donhang_id === donhang_id
                    ? new DonHang({ ...o, trangthai })
                    : o
            ))
        }
        setUpdating(false)
        return res
    }

    // const removeOrder = async (donhang_id) => {
    //     const res = await donHangService.remove(donhang_id)
    //     if (res.success) {
    //         setOrders(prev => prev.filter(o => o.donhang_id !== donhang_id))
    //         setTotal(t => t - 1)
    //     }
    //     return res
    // }

    const cancelOrder = async (donhang_id) => {
        return await updateTrangthai(donhang_id, TRANG_THAI_DON_HANG.DA_HUY)
    }

    return {
        orders, loading, updating,
        page, setPage,
        totalPages, total,
        filterTrangthai, setFilterTrangthai,
        updateTrangthai, cancelOrder,
        refetch: fetchOrders,
    }
}

export default useDonHangManager