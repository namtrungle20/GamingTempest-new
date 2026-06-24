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


    const currentUser = (() => {
        try {
            const raw = localStorage.getItem('user')
            return raw ? JSON.parse(raw) : null
        } catch { return null }
    })()

    const isLoggedIn = !!currentUser
    const isAdmin = currentUser?.vaitro === 1

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

    useEffect(() => { fetchReviews() }, [fetchReviews])

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
        if (result.success) {
            await fetchReviews()
        }
        setDeleting(null)
        return result.success
    }, [fetchReviews])

    // Kiểm tra user hiện tại đã review chưa
    const daReview = isLoggedIn
        ? reviews.some(r => r.nguoidung?.id === currentUser?.nguoidung_id)
        : false

    return {
        // Data
        reviews,
        stats,
        // State
        loading,
        submitting,
        deleting,
        error,
        submitError,
        setSubmitError,
        // Auth
        currentUser,
        isLoggedIn,
        isAdmin,
        daReview,
        // Actions
        fetchReviews,
        submitReview,
        deleteReview,
    }
}

export default useDanhGia;