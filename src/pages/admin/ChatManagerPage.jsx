import { useState, useRef, useEffect } from 'react'
import * as Mui from '@mui/material'
import useChat from '@/hook/chat/useChat'
import useHoiThoai from '@/hook/chat/useHoiThoai'

const ChatManagerPage = () => {
    const { conversations } = useHoiThoai()
    const [selected, setSelected] = useState(null)
    const [input, setInput] = useState('')
    const bottomRef = useRef(null)

    const { messages, sending, sendMessage } = useChat(selected, 'admin')

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || sending) return
        const text = input
        setInput('')
        await sendMessage(text)
    }

    return (
        <Mui.Box sx={{ display: 'flex', height: '80vh', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Mui.Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto' }}>
                <Mui.Typography variant="subtitle2" fontWeight={700} sx={{ p: 1.5 }}>
                    Hội thoại ({conversations.length})
                </Mui.Typography>
                {conversations.map((c) => (
                    <Mui.Box
                        key={c.nguoidungId}
                        onClick={() => setSelected(c.nguoidungId)}
                        sx={{
                            p: 1.5, cursor: 'pointer',
                            bgcolor: selected === c.nguoidungId ? 'action.selected' : 'transparent',
                            '&:hover': { bgcolor: 'action.hover' },
                            borderBottom: '1px solid', borderColor: 'divider',
                        }}
                    >
                        <Mui.Typography fontWeight={700} variant="body2">{c.name || c.sdt}</Mui.Typography>
                        <Mui.Typography variant="caption" color="text.secondary" noWrap display="block">
                            {c.tinNhanCuoi}
                        </Mui.Typography>
                    </Mui.Box>
                ))}
            </Mui.Box>

            <Mui.Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!selected ? (
                    <Mui.Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mui.Typography color="text.secondary">Chọn 1 hội thoại để bắt đầu</Mui.Typography>
                    </Mui.Box>
                ) : (
                    <>
                        <Mui.Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {messages.map((m) => (
                                <Mui.Box key={m.id} sx={{
                                    alignSelf: m.isAdmin ? 'flex-end' : 'flex-start',
                                    bgcolor: m.isAdmin ? 'primary.main' : 'grey.200',
                                    color: m.isAdmin ? 'white' : 'text.primary',
                                    px: 1.5, py: 0.8, borderRadius: 2, maxWidth: '60%',
                                }}>
                                    <Mui.Typography variant="body2">{m.noidung}</Mui.Typography>
                                </Mui.Box>
                            ))}
                            <div ref={bottomRef} />
                        </Mui.Box>
                        <Mui.Box sx={{ p: 1.5, display: 'flex', gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Mui.TextField
                                size="small" fullWidth value={input} placeholder="Trả lời khách..."
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={sending}
                            />
                            <Mui.Button variant="contained" onClick={handleSend} disabled={sending}>Gửi</Mui.Button>
                        </Mui.Box>
                    </>
                )}
            </Mui.Box>
        </Mui.Box>
    )
}

export default ChatManagerPage