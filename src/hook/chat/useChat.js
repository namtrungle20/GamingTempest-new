import { useState, useEffect, useCallback, useRef } from 'react'
import socket from '@/config/socket.js'
import chatService from '@/services/chat.service'
import TinNhan from '@/models/TinNhan'

/**
 * @param {string|null} nguoidungId - user: id chính mình; admin: id hội thoại đang chọn (có thể null)
 * @param {'user'|'admin'} mode
 */
const useChat = (nguoidungId, mode = 'user', isGuest = false) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)
    const currentIdRef = useRef(nguoidungId)


    useEffect(() => {
        currentIdRef.current = nguoidungId
    }, [nguoidungId])

    // Join room + lắng nghe realtime
    useEffect(() => {
        if (!socket.connected) socket.connect()

        if (mode === 'admin') {
            socket.emit('join-admin')
        } else if (nguoidungId) {
            socket.emit(isGuest ? 'join-guest' : 'join-user', nguoidungId)
        }

        const handleReceive = (raw) => {
            const msg = new TinNhan(raw)
            const msgId = isGuest ? msg.guestId : msg.nguoidungId
            if (msgId === currentIdRef.current) {
                setMessages(prev => {
                    // Chặn trùng lặp: nếu id này đã có trong danh sách, bỏ qua
                    if (prev.some(m => m.id === msg.id)) return prev
                    return [...prev, msg]
                })
            }
        }
        socket.on('chat:receive', handleReceive)
        return () => socket.off('chat:receive', handleReceive)
    }, [mode, nguoidungId, isGuest])

    // Load lịch sử khi đổi hội thoại
    useEffect(() => {
        if (!nguoidungId) {
            setMessages([])
            return
        }
        setLoading(true)
        chatService.getLichSuChat(nguoidungId, isGuest)
            .then(data => {
                const loaded = data.map(d => new TinNhan(d))
                setMessages(prev => {
                    // Gộp lịch sử vừa load với tin realtime đã nhận trước đó (nếu có), khử trùng theo id
                    const merged = [...loaded]
                    prev.forEach(m => {
                        if (!merged.some(x => x.id === m.id)) merged.push(m)
                    })
                    return merged.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                })
            })
            .catch(() => setMessages([]))
            .finally(() => setLoading(false))
    }, [nguoidungId])

    const sendMessage = useCallback(async (noidung) => {
        const text = noidung.trim()
        if (!text) return

        setSending(true)
        try {
            await chatService.guiTinNhan({
                nguoidungId: isGuest ? null : nguoidungId,
                noidung: text,
                guestId: isGuest ? nguoidungId : null,
                isAdmin: mode === 'admin'
            })
            // setMessages(prev => [...prev, new TinNhan(data)])
        } finally {
            setSending(false)
        }
    }, [mode, nguoidungId, isGuest])

    return { messages, loading, sending, sendMessage }
}

export default useChat