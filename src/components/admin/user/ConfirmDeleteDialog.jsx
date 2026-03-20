import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'

const ConfirmDeleteDialog = ({ open, onConfirm, onCancel, title, message }) => {
    return (
        <Mui.Dialog
            open={open}
            onClose={onCancel}
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    minWidth: { xs: '90%', sm: 400 },
                }
            }}
        >
            <Mui.DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 2 }}>
                <Mui.Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: 'error.lighter',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'error.main',
                    }}
                >
                    <Icon.WarningAmber />
                </Mui.Box>
                <Mui.Typography variant="h6" fontWeight={700}>
                    {title || 'Xác nhận xóa'}
                </Mui.Typography>
            </Mui.DialogTitle>

            <Mui.DialogContent>
                <Mui.Typography color="text.secondary">
                    {message || 'Bạn có chắc chắn muốn xóa? Hành động này không thể hoàn tác.'}
                </Mui.Typography>
            </Mui.DialogContent>

            <Mui.DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Mui.Button
                    onClick={onCancel}
                    variant="outlined"
                    sx={{ minWidth: 100 }}
                >
                    Hủy
                </Mui.Button>
                <Mui.Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    sx={{ minWidth: 100 }}
                >
                    Xóa
                </Mui.Button>
            </Mui.DialogActions>
        </Mui.Dialog>
    )
}

export default ConfirmDeleteDialog