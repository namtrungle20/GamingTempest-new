import { useState, useRef, useEffect } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import useChat from '@/hook/chat/useChat'
import useHoiThoai from '@/hook/chat/useHoiThoai'

const ChatManagerPage = () => {
    const { hoithoais, xoaHoiThoai, loadMore, hasMore, loadingMore } = useHoiThoai()
    const [selected, setSelected] = useState(null)
    const [isGuestSelected, setIsGuestSelected] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [input, setInput] = useState('')
    const bottomRef = useRef(null)

    const { messages, sending, sendMessage } = useChat(selected, 'admin', isGuestSelected)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSelect = (c) => {
        setSelected(c.hoiThoaiKey)
        setIsGuestSelected(!c.nguoidungId)
    }

    const handleSend = async () => {
        if (!input.trim() || sending) return
        const text = input
        setInput('')
        await sendMessage(text)
    }

    const handleDelete = async () => {
        if (!confirmDelete) return
        await xoaHoiThoai(confirmDelete.hoiThoaiKey, !confirmDelete.nguoidungId)
        if (selected === confirmDelete.hoiThoaiKey) {
            setSelected(null) // đang xem đúng hội thoại vừa xoá thì thoát ra
        }
        setConfirmDelete(null)
    }


    return (
        <Mui.Box sx={{ display: 'flex', height: '80vh', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Mui.Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', overflowY: 'auto' }}>
                <Mui.Typography variant="subtitle2" fontWeight={700} sx={{ p: 1.5 }}>
                    Hội thoại ({hoithoais.length})
                </Mui.Typography>
                {hoithoais.map((c) => (
                    <Mui.Box
                        key={c.hoiThoaiKey}
                        onClick={() => handleSelect(c)}
                        sx={{
                            p: 1.5, cursor: 'pointer',
                            bgcolor: selected === c.hoiThoaiKey ? 'action.selected' : 'transparent',
                            '&:hover': { bgcolor: 'action.hover' },
                            borderBottom: '1px solid', borderColor: 'divider',
                        }}
                    >
                        {hasMore && (
                            <Mui.Box sx={{ p: 1.5, textAlign: 'center' }}>
                                <Mui.Button size="small" onClick={loadMore} disabled={loadingMore}>
                                    {loadingMore ? <Mui.CircularProgress size={16} /> : 'Xem thêm'}
                                </Mui.Button>
                            </Mui.Box>
                        )}
                        <Mui.Stack direction="row" alignItems="center" sx={{ '&:hover .delete-btn': { opacity: 1 } }}>
                            <Mui.Box onClick={() => handleSelect(c)} sx={{ flex: 1, cursor: 'pointer', minWidth: 0 }}>
                                <Mui.Stack direction="row" alignItems="center" gap={0.5}>
                                    <Mui.Typography fontWeight={700} variant="body2" noWrap>{c.name || c.sdt}</Mui.Typography>
                                    {!c.nguoidungId && (
                                        <Mui.Chip label="Khách" size="small" color="warning" sx={{ height: 18, fontSize: 10 }} />
                                    )}
                                </Mui.Stack>
                                <Mui.Typography variant="caption" color="text.secondary" noWrap display="block">
                                    {c.tinNhanCuoi}
                                </Mui.Typography>
                            </Mui.Box>

                            <Mui.IconButton
                                className="delete-btn"
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setConfirmDelete(c)
                                }}
                                sx={{
                                    opacity: { xs: 1, sm: 0 },
                                    transition: 'opacity 0.15s',
                                    color: 'text.disabled',
                                    '&:hover': { color: 'error.main', bgcolor: 'error.lighter' },
                                }}
                            >
                                <Icon.DeleteOutline fontSize="small" />
                            </Mui.IconButton>
                        </Mui.Stack>

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
                                    bgcolor: m.isAdmin ? 'primary.main' : 'background.paper',
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
            <Mui.Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <Mui.DialogTitle>Xoá hội thoại?</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.Typography variant="body2">
                        Toàn bộ tin nhắn với <strong>{confirmDelete?.name || confirmDelete?.sdt}</strong> sẽ bị xoá vĩnh viễn, không thể khôi phục.
                    </Mui.Typography>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Mui.Button onClick={() => setConfirmDelete(null)}>Huỷ</Mui.Button>
                    <Mui.Button color="error" variant="contained" onClick={handleDelete}>Xoá</Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>
        </Mui.Box >
    )
}

export default ChatManagerPage