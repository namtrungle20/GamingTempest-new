import { useState, useEffect, useCallback } from 'react';
import { rankService } from '@/services/rank.service';
import socket from '@/config/socket';


const useMemberRank = (autoFetch = true) => {
    const [data, setData] = useState({
        hangthanhvien: 0,
        label: 'Đồng',
        giam_ship: 0,
        tong_chi_tieu: 0,
        hangTiepTheo: null,
        labelTiepTheo: null,
        conThieu: 0,
        phanTramTienDo: 0,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchHang = useCallback(async () => {
        setLoading(true)
        setError('')
        const result = await rankService.getRank()
        if (result.success) {
            const raw = result.raw.data
            setData({
                hangthanhvien: raw.hang_thanh_vien,
                label: raw.label,
                giam_ship: raw.giam_ship,
                tong_chi_tieu: raw.tong_chi_tieu,
                hangTiepTheo: raw.hangTiepTheo,
                labelTiepTheo: raw.labelTiepTheo,
                conThieu: raw.conThieu,
                phanTramTienDo: raw.phanTramTienDo,
            })
        } else {
            setError(result.message)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (autoFetch) fetchHang()
        else setLoading(false)
    }, [autoFetch, fetchHang])

    // ✅ Lắng nghe socket — tự động refetch khi backend báo hạng thay đổi
    useEffect(() => {
        const handleRankUpdated = (data) => {
            console.log('🟢 Received rank-updated:', data) // ✅ thêm dòng này
            fetchHang()
        }
        socket.on('rank-updated', handleRankUpdated)
        return () => socket.off('rank-updated', handleRankUpdated)
    }, [fetchHang])

    return { ...data, loading, error, refetch: fetchHang }
}

export default useMemberRank;