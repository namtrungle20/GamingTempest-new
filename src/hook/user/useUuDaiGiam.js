import { useState, useEffect } from 'react'
import uuDaiService from '@/services/uudai.service'

// enabled: chỉ gọi API khi user đã đăng nhập (giống pattern useMemberRank(!!user))
const useUuDaiGiam = (enabled) => {
    const [phanTramGiam, setPhanTramGiam] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!enabled) {
            setPhanTramGiam(0)
            setLoading(false)
            return
        }
        let mounted = true
        setLoading(true)
        uuDaiService.getCuaToi().then(res => {
            if (!mounted) return
            if (res.success) setPhanTramGiam(parseFloat(res.data.phan_tram_giam) || 0)
            setLoading(false)
        })
        return () => { mounted = false }
    }, [enabled])

    return { phanTramGiam, loading }
}

export default useUuDaiGiam