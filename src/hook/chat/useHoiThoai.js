import { useState, useEffect, useCallback } from 'react'
import socket from '@/config/socket'
import chatService from '@/services/chat.service'
import HoiThoai from '@/models/HoiThoai'

const PAGE_SIZE = 20

const useHoiThoai = () => {
    const [hoithoais, setHoithoais] = useState([])
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)

    const refetch = useCallback(async () => {
        const data = await chatService.getDanhSachHoiThoai()
        setHoithoais(data.map(d => new HoiThoai(d)))
    }, [])

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return
        setLoadingMore(true)
        try {
            const data = await chatService.getDanhSachHoiThoai(PAGE_SIZE, hoithoais.length)
            setHoithoais(prev => [...prev, ...data.map(d => new HoiThoai(d))])
            setHasMore(data.length === PAGE_SIZE)
        } finally {
            setLoadingMore(false)
        }
    }, [hoithoais.length, hasMore, loadingMore])

    const xoaHoiThoai = useCallback(async (id, isGuest) => {
        await chatService.xoaHoiThoai(id, isGuest)
        setHoithoais(prev => prev.filter(c => c.hoiThoaiKey !== id)) // xoá khỏi UI ngay, không cần chờ refetch
    }, [])

    useEffect(() => {
        refetch()
        socket.on('chat:receive', refetch)
        return () => socket.off('chat:receive', refetch)
    }, [refetch])

    return { hoithoais, refetch, xoaHoiThoai }
}

export default useHoiThoai