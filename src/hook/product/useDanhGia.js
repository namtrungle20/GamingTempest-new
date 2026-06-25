import { useState, useEffect, useCallback } from 'react';
import { danhGiaService } from '@/services/danhgia.service';

const useDanhGia = (sanpham_id) => {
    const [reviews, setReviews] = useState([])
    const [stats, setStats] = useState({
        trung_binh_sao: 0,
        tong_danh_gia: 0,
        phan_phoi_sao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    })
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [error, setError] = useState('')
    const [submitError, setSubmitError] = useState('')
    const [daMua, setDaMua] = useState(false)
    const [checkingMua, setCheckingMua] = useState(false)

    // Lấy thông tin user hiện tại từ localStorage
    const currentUser = (() => {
        try {
            const raw = localStorage.getItem('user')
            return raw ? JSON.parse(raw) : null
        } catch { return null }
    })()

    const isLoggedIn = !!currentUser
    const isAdmin = currentUser?.vaitro === 1

    // Fetch danh sách đánh giá + stats
    const fetchReviews = useCallback(async () => {
        if (!sanpham_id) return
        setLoading(true)
        setError('')
        const result = await danhGiaService.getAll({ sanpham_id })
        if (result.success) {
            setReviews(result.raw.data || [])
            setStats({
                trung_binh_sao: result.raw.trung_binh_sao || 0,
                tong_danh_gia: result.raw.tong_danh_gia || 0,
                phan_phoi_sao: result.raw.phan_phoi_sao || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            })
        } else {
            setError(result.message)
        }
        setLoading(false)
    }, [sanpham_id])

    // Check user đã mua sản phẩm chưa
    const fetchDaMua = useCallback(async () => {
        if (!sanpham_id || !isLoggedIn) return
        setCheckingMua(true)
        const result = await danhGiaService.checkDaMua({ sanpham_id })
        setDaMua(result.raw?.da_mua || false)
        setCheckingMua(false)
    }, [sanpham_id, isLoggedIn])

    useEffect(() => { fetchReviews() }, [fetchReviews])
    useEffect(() => { fetchDaMua() }, [fetchDaMua])

    const submitReview = useCallback(async ({ sosao, binhluan }) => {
        setSubmitError('')
        if (!sosao || sosao < 1 || sosao > 5) {
            setSubmitError('Vui lòng chọn số sao')
            return false
        }
        setSubmitting(true)
        const result = await danhGiaService.create({ sanpham_id, sosao, binhluan })
        if (result.success) {
            await fetchReviews()
            setSubmitting(false)
            return true
        } else {
            setSubmitError(result.message)
            setSubmitting(false)
            return false
        }
    }, [sanpham_id, fetchReviews])

    const deleteReview = useCallback(async (danhgia_id) => {
        setDeleting(danhgia_id)
        const result = await danhGiaService.remove(danhgia_id)
        if (result.success) await fetchReviews()
        setDeleting(null)
        return result.success
    }, [fetchReviews])

    // Đã review chưa
    const daReview = isLoggedIn
        ? reviews.some(r => r.nguoidung?.id === currentUser?.nguoidung_id)
        : false

    return {
        reviews, stats,
        loading, submitting, deleting, checkingMua,
        error, submitError, setSubmitError,
        currentUser, isLoggedIn, isAdmin,
        daReview, daMua,
        fetchReviews, submitReview, deleteReview,
    }
}

export default useDanhGia;