import { useState, useRef, useEffect, useMemo } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { useAuth } from '@/hook/provider/AuthProvider'
import useChat from '@/hook/chat/useChat'

const getGuestId = () => {
    let id = localStorage.getItem('guestId')
    if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem('guestId', id)
    }
    return id
}

const ChatWidget = () => {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState('')
    const bottomRef = useRef(null)

    const guestId = useMemo(() => (user ? null : getGuestId()), [user])
    const chatId = user?.id || guestId
    const isGuest = !user

    const { messages, sending, sendMessage } = useChat(chatId, 'user', isGuest)

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, open])

    const handleSend = async () => {
        if (!input.trim() || sending) return
        const text = input
        setInput('')
        await sendMessage(text)
    }

    return (
        <>
            <Mui.Fab color="primary" onClick={() => setOpen(o => !o)} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300 }}>
                {open ? <Icon.Close /> : <Icon.ChatBubbleOutline />}
            </Mui.Fab>

            {open && (
                <Mui.Paper elevation={6} sx={{
                    position: 'fixed', bottom: 96, right: 24,
                    width: { xs: '90vw', sm: 340 }, height: 440,
                    display: 'flex', flexDirection: 'column',
                    borderRadius: 3, overflow: 'hidden', zIndex: 1300,
                }}>
                    <Mui.Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 1.5 }}>
                        <Mui.Typography fontWeight={700}>Hỗ trợ trực tuyến</Mui.Typography>
                        <Mui.Typography variant="caption">Có gì thắc mắc, hỏi ngay nhé!</Mui.Typography>
                    </Mui.Box>

                    <Mui.Box sx={{ flex: 1, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {messages.length === 0 && (
                            <Mui.Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                                Gửi câu hỏi đầu tiên cho chúng tôi nhé!
                            </Mui.Typography>
                        )}
                        {messages.map((m) => (
                            <Mui.Box key={m.id} sx={{
                                alignSelf: m.isCustomer ? 'flex-end' : 'flex-start',
                                bgcolor: m.isCustomer ? 'primary.main' : 'background.paper',
                                color: m.isCustomer ? 'primary.contrastText' : 'text.primary',
                                px: 1.5, py: 0.8, borderRadius: 2, maxWidth: '75%',
                                boxShadow: m.isCustomer ? 'none' : 1,
                            }}>
                                <Mui.Typography variant="body2">{m.noidung}</Mui.Typography>
                            </Mui.Box>
                        ))}
                        <div ref={bottomRef} />
                    </Mui.Box>

                    <Mui.Box sx={{ p: 1, display: 'flex', gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Mui.TextField
                            size="small"
                            fullWidth
                            placeholder="Nhập câu hỏi..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={sending}
                        />
                        <Mui.IconButton color="primary" onClick={handleSend} disabled={sending}>
                            <Icon.Send />
                        </Mui.IconButton>
                    </Mui.Box>
                </Mui.Paper>
            )}
        </>
    )
}
export default ChatWidget