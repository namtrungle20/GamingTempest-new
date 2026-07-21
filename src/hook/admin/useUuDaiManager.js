import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import uuDaiService from '@/services/uudai.service'

const useUuDaiManager = () => {
    const [danhSach, setDanhSach] = useState([])
    const [loading, setLoading] = useState(true)
    const [savingHang, setSavingHang] = useState(null)

    const fetchDanhSach = useCallback(async () => {
        setLoading(true)
        const res = await uuDaiService.getDanhSach()
        if (res.success) {
            setDanhSach(res.data)
        } else {
            toast.error(res.message)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchDanhSach()
    }, [fetchDanhSach])

    // Cập nhật local trước để gõ mượt, không gọi API mỗi phím
    const handleChangePhanTram = (hang, value) => {
        setDanhSach(prev => prev.map(item =>
            item.hang === hang ? { ...item, phan_tram_giam: value } : item
        ))
    }

    const handleToggleTrangThai = async (hang, trang_thai) => {
        setDanhSach(prev => prev.map(item =>
            item.hang === hang ? { ...item, trang_thai } : item
        ))
        const res = await uuDaiService.update(hang, { trang_thai })
        if (res.success) {
            toast.success(trang_thai ? 'Đã bật ưu đãi' : 'Đã tắt ưu đãi')
        } else {
            // rollback nếu lỗi
            setDanhSach(prev => prev.map(item =>
                item.hang === hang ? { ...item, trang_thai: !trang_thai } : item
            ))
            toast.error(res.message)
        }
    }

    const handleSavePhanTram = async (hang) => {
        const item = danhSach.find(i => i.hang === hang)
        if (!item) return

        const phanTram = parseFloat(item.phan_tram_giam)
        if (Number.isNaN(phanTram) || phanTram < 0 || phanTram > 100) {
            toast.error('Phần trăm giảm phải trong khoảng 0 - 100')
            return
        }

        setSavingHang(hang)
        const res = await uuDaiService.update(hang, { phan_tram_giam: phanTram })
        if (res.success) {
            toast.success('Cập nhật ưu đãi thành công')
        } else {
            toast.error(res.message)
        }
        setSavingHang(null)
    }

    return {
        danhSach,
        loading,
        savingHang,
        handleChangePhanTram,
        handleToggleTrangThai,
        handleSavePhanTram,
    }
}

export default useUuDaiManager