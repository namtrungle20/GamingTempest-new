import { useRef, useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import ImageLibrary from '@/components/admin/image/ImageLibrary'

/**
 * MotaEditor — Textarea mô tả sản phẩm có nút chọn ảnh từ ImageLibrary
 *
 * Props:
 *   value    : string              — giá trị hiện tại của form.mota
 *   onChange : (val: string) => void — callback khi nội dung thay đổi
 *   rows     : number              — số dòng textarea (default 5)
 */
const MotaEditor = ({ value, onChange, rows = 5 }) => {
    const textareaRef = useRef(null)
    const [libraryOpen, setLibraryOpen] = useState(false)
    // Lưu cursor position trước khi mở dialog
    const cursorPosRef = useRef(null)

    // Chèn chuỗi vào vị trí con trỏ đã lưu
    const insertAtCursor = (text) => {
        const pos = cursorPosRef.current
        const current = value || ''
        const start = pos?.start ?? current.length
        const end = pos?.end ?? current.length
        const newVal = current.slice(0, start) + text + current.slice(end)
        onChange(newVal)

        // Khôi phục focus và cursor sau re-render
        requestAnimationFrame(() => {
            const el = textareaRef.current?.querySelector('textarea')
            if (el) {
                el.focus()
                const newPos = start + text.length
                el.setSelectionRange(newPos, newPos)
            }
        })
    }

    // Lưu vị trí cursor trước khi mở dialog
    const handleOpenLibrary = () => {
        const el = textareaRef.current?.querySelector('textarea')
        if (el) {
            cursorPosRef.current = { start: el.selectionStart, end: el.selectionEnd }
        }
        setLibraryOpen(true)
    }

    // Callback khi chọn ảnh từ ImageLibrary
    const handleSelectImage = (imageUrl) => {
        const markdown = `\n![ảnh](${imageUrl})\n`
        insertAtCursor(markdown)
        setLibraryOpen(false)
    }

    return (
        <Mui.Box>
            {/* Toolbar */}
            <Mui.Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.75,
                border: '1px solid',
                borderColor: 'divider',
                borderBottom: 'none',
                borderRadius: '8px 8px 0 0',
                bgcolor: 'action.hover',
            }}>
                <Mui.Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ flexGrow: 1 }}>
                    Mô tả sản phẩm
                    <Mui.Typography component="span" variant="caption" color="text.disabled" sx={{ ml: 1 }}>
                        (hỗ trợ Markdown)
                    </Mui.Typography>
                </Mui.Typography>

                {/* Nút chọn ảnh từ thư viện */}
                <Mui.Tooltip title="Chèn ảnh từ thư viện">
                    <Mui.IconButton
                        size="small"
                        onClick={handleOpenLibrary}
                        sx={{ color: 'primary.main' }}
                    >
                        <Icon.Collections fontSize="small" />
                    </Mui.IconButton>
                </Mui.Tooltip>
            </Mui.Box>

            {/* Textarea */}
            <Mui.TextField
                ref={textareaRef}
                fullWidth
                multiline
                rows={rows}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Nhập mô tả sản phẩm...\n\nHỗ trợ Markdown:\n# Tiêu đề\n**In đậm**\n- Danh sách\n![tên ảnh](url)`}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '0 0 8px 8px',
                        '& fieldset': { borderColor: 'divider' },
                    },
                    '& textarea': { fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.7 },
                }}
            />

            {/* Hint */}
            <Mui.Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                Bấm <Icon.Collections sx={{ fontSize: 12, verticalAlign: 'middle' }} /> để chọn ảnh từ thư viện, ảnh sẽ được chèn tại vị trí con trỏ.
            </Mui.Typography>

            {/* Dialog ImageLibrary */}
            <Mui.Dialog
                open={libraryOpen}
                onClose={() => setLibraryOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <Mui.DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Mui.Typography fontWeight={800}>Chọn ảnh từ thư viện</Mui.Typography>
                    <Mui.IconButton onClick={() => setLibraryOpen(false)}>
                        <Icon.Close />
                    </Mui.IconButton>
                </Mui.DialogTitle>
                <Mui.DialogContent dividers>
                    <Mui.Typography variant="body2" color="text.secondary" mb={2}>
                        Bấm vào ảnh để chèn vào mô tả
                    </Mui.Typography>
                    {/* Truyền onSelectForMota để ImageLibrary callback URL về */}
                    <ImageLibrary onSelectForMota={handleSelectImage} />
                </Mui.DialogContent>
            </Mui.Dialog>
        </Mui.Box>
    )
}

export default MotaEditor