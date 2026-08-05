import React, { useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { useAuth } from '@/hook/provider/AuthContext'
import VerifyOtpModal from '../auth/VerifyOtpModal'

const ChangeEmailCard = () => {
    const { user, requestChangeEmail, verifyChangeEmail, loading, error } = useAuth()
    const [editing, setEditing] = useState(false)
    const [emailMoi, setEmailMoi] = useState('')
    const [otpOpen, setOtpOpen] = useState(false)
    const [localError, setLocalError] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const handleRequestChange = async () => {
        setLocalError(null)
        if (!emailMoi || emailMoi === user?.email) {
            setLocalError('Vui lòng nhập email mới hợp lệ')
            return
        }
        const result = await requestChangeEmail(emailMoi)
        if (result.success) {
            setOtpOpen(true)
        }
    }

    const handleVerified = () => {
        setOtpOpen(false)
        setEditing(false)
        setEmailMoi('')
        setSnackbar({ open: true, message: 'Đổi email thành công', severity: 'success' })
    }

    return (
        <>
            <Mui.Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
                <Mui.Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                    Email tài khoản
                </Mui.Typography>

                {!editing ? (
                    <Mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Mui.Typography variant="body2" color="text.secondary">
                            {user?.email || 'Chưa có email'}
                        </Mui.Typography>
                        <Mui.Button
                            size="small"
                            startIcon={<Icon.EditOutlined />}
                            onClick={() => setEditing(true)}
                        >
                            Đổi email
                        </Mui.Button>
                    </Mui.Box>
                ) : (
                    <Mui.Stack spacing={1.5}>
                        {(localError || error) && (
                            <Mui.Alert severity="error" onClose={() => setLocalError(null)}>
                                {localError || error}
                            </Mui.Alert>
                        )}
                        <Mui.TextField
                            fullWidth
                            size="small"
                            label="Email mới"
                            value={emailMoi}
                            onChange={(e) => setEmailMoi(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRequestChange()}
                        />
                        <Mui.Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Mui.Button
                                size="small"
                                onClick={() => { setEditing(false); setEmailMoi(''); setLocalError(null) }}
                            >
                                Hủy
                            </Mui.Button>
                            <Mui.Button
                                size="small"
                                variant="contained"
                                onClick={handleRequestChange}
                                disabled={loading}
                            >
                                {loading ? <Mui.CircularProgress size={18} color="inherit" /> : 'Gửi mã xác thực'}
                            </Mui.Button>
                        </Mui.Box>
                    </Mui.Stack>
                )}
            </Mui.Paper>

            <VerifyOtpModal
                open={otpOpen}
                handleClose={() => setOtpOpen(false)}
                onVerify={verifyChangeEmail}
                onResend={() => requestChangeEmail(emailMoi)}
                loading={loading}
                error={error}
                onVerified={handleVerified}
            />

            <Mui.Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Mui.Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Mui.Alert>
            </Mui.Snackbar>
        </>
    )
}

export default ChangeEmailCard