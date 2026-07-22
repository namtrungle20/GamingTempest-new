// hook/admin/useDonHangManager.js
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

    // Giữ nguyên prototype (nguoiDung, chiTiet...) khi patch 1 field trong state,
    // tránh new DonHang({...instance}) làm mất field do lệch tên (nguoiDung vs NguoiDung)
    const patchOrder = (donhang_id, patch) => {
        setOrders(prev => prev.map(o => {
            if (o.donhang_id !== donhang_id) return o
            const updated = Object.create(Object.getPrototypeOf(o))
            Object.assign(updated, o, patch)
            return updated
        }))
    }

    const updateTrangthai = async (donhang_id, trangthai) => {
        setUpdating(true)
        const res = await donHangService.update(donhang_id, { trangthai })
        if (res.success) {
            patchOrder(donhang_id, { trangthai })
        }
        setUpdating(false)
        return res
    }

    // ✅ nhận thêm payload { ly_do_huy, ghi_chu_huy } và forward xuống service
    const cancelOrder = async (donhang_id, payload = {}) => {
        setUpdating(true)
        const res = await donHangService.remove(donhang_id, payload)
        if (res.success) {
            patchOrder(donhang_id, {
                trangthai: TRANG_THAI_DON_HANG.DA_HUY,
                ly_do_huy: payload.ly_do_huy ?? null,
                ghi_chu_huy: payload.ghi_chu_huy ?? null,
                // huy_boi nên lấy từ res.raw.data nếu backend trả về, vì admin hủy
                // thì huy_boi phải là "ADMIN" — FE không tự biết giá trị này
                huy_boi: res.raw?.data?.huy_boi ?? null,
            })
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