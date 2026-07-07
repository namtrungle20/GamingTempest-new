// hook/admin/useDonHang.js
import { useState, useCallback, useEffect } from 'react'
import { donHangService } from '@/services/donhang.service'
import DonHang from '@/models/DonHang'
import { TRANG_THAI_DON_HANG } from '@/constants/donhangContants'

const useDonHangManager = () => {
    const [orders, setOrders] = useState([])   // DonHangModel[]
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [updating, setUpdating] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [total, setTotal] = useState(0)
    const [filterTrangthai, setFilterTrangthai] = useState('')
    const [createdAt, setCreatedAt] = useState('')

    const fetchOrders = useCallback(async () => {
        setLoading(true)
        const res = await donHangService.getAll({
            search,
            trangthai: filterTrangthai,
            created_at: createdAt,
            page
        })
        if (res.success) {
            setOrders(DonHang.fromList(res.raw.data || []))
            setTotalPages(res.raw.totalPages || 1)
            setTotal(res.raw.total || 0)
        }
        setLoading(false)
    }, [search, filterTrangthai, createdAt, page])

    useEffect(() => {
        fetchOrders()
    }, [fetchOrders])

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


    const cancelOrder = async (donhang_id) => {
        setUpdating(true)
        const res = await donHangService.remove(donhang_id)
        if (res.success) {
            setOrders(prev => prev.map(o =>
                o.donhang_id === donhang_id
                    ? new DonHang({ ...o, trangthai: TRANG_THAI_DON_HANG.DA_HUY })
                    : o
            ))
        }
        setUpdating(false)
        return res
    }

    return {
        orders, loading, updating,
        page, setPage,
        search, setSearch,
        totalPages, total,
        filterTrangthai, setFilterTrangthai, createdAt, setCreatedAt,
        updateTrangthai, cancelOrder,
        refetch: fetchOrders,
    }
}

export default useDonHangManager