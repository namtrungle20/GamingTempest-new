import { useState, useEffect, useCallback } from 'react'
import socket from '@/lib/socket'
import chatService from '@/services/chat.service'
import HoiThoai from '@/models/HoiThoai'

const useHoiThoai = () => {
    const [hoithoais, setHoithoais] = useState([])

    const refetch = useCallback(async () => {
        const data = await chatService.getDanhSachHoiThoai()
        setHoithoais(data.map(d => new HoiThoai(d)))
    }, [])

    useEffect(() => {
        refetch()
        socket.on('chat:receive', refetch)
        return () => socket.off('chat:receive', refetch)
    }, [refetch])

    return { hoithoais, refetch }
}

export default useHoiThoai