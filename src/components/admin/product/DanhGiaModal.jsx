import { useState } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';


const DanhGiaModal = ({ open, onClose, onSubmit, submitting, submitError, setSubmitError }) => {
    const [sosao, setSosao] = useState(0)
    const [hoverSao, setHoverSao] = useState(-1)
    const [binhluan, setBinhluan] = useState('')

    const handleSubmit = async () => {
        const ok = await onSubmit({ sosao, binhluan })
        if (ok) {
            setSosao(0)
            setBinhluan('')
            onClose()
        }
    }

    const handleClose = () => {
        setSosao(0)
        setBinhluan('')
        setSubmitError('')
        onClose()
    }

    return (
        <Mui.Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <Mui.DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Mui.Typography fontWeight={800}>Đánh giá sản phẩm</Mui.Typography>
                <Mui.IconButton onClick={handleClose}><Icon.Close /></Mui.IconButton>
            </Mui.DialogTitle>

            <Mui.DialogContent dividers>
                <Mui.Stack spacing={2.5}>
                    {/* Chọn sao */}
                    <Mui.Box>
                        <Mui.Typography variant="body2" color="text.secondary" mb={1} fontWeight={600}>
                            Chất lượng sản phẩm
                        </Mui.Typography>
                        <Mui.Box display="flex" alignItems="center" gap={1.5}>
                            <Mui.Rating
                                value={sosao}
                                onChange={(_, val) => { setSosao(val); setSubmitError('') }}
                                onChangeActive={(_, val) => setHoverSao(val)}
                                onMouseLeave={() => setHoverSao(-1)}
                                size="large"
                            />
                            <Mui.Typography variant="body2" color="primary.main" fontWeight={700} sx={{ minWidth: 70 }}>
                                {['', 'Tệ', 'Không tốt', 'Bình thường', 'Tốt', 'Xuất sắc'][hoverSao > 0 ? hoverSao : sosao]}
                            </Mui.Typography>
                        </Mui.Box>
                    </Mui.Box>

                    {/* Bình luận */}
                    <Mui.TextField
                        fullWidth multiline rows={4}
                        label="Nhận xét của bạn"
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                        value={binhluan}
                        onChange={e => setBinhluan(e.target.value)}
                    />

                    {submitError && (
                        <Mui.Alert severity="error" sx={{ py: 0.5 }}>{submitError}</Mui.Alert>
                    )}
                </Mui.Stack>
            </Mui.DialogContent>

            <Mui.DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Mui.Button onClick={handleClose} sx={{ fontWeight: 700 }}>Để sau</Mui.Button>
                <Mui.Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting || sosao === 0}
                    startIcon={submitting ? <Mui.CircularProgress size={16} /> : <Icon.Send />}
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                >
                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Mui.Button>
            </Mui.DialogActions>
        </Mui.Dialog>
    )
}

export default DanhGiaModal