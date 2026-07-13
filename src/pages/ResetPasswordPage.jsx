import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { authResetService } from '@/services/auth.service'

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    const [matKhauMoi, setMatKhauMoi] = useState('')
    const [xacNhan, setXacNhan] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) navigate('/forgot-password')
    }, [token, navigate])

    const handleSubmit = async (e) => {
        e?.preventDefault()
        if (!matKhauMoi || matKhauMoi.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }
        if (matKhauMoi !== xacNhan) {
            setError('Mật khẩu xác nhận không khớp')
            return
        }
        setLoading(true)
        setError('')
        const result = await authResetService.datLaiMatKhau(token, matKhauMoi)
        setLoading(false)
        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.message)
        }
    }

    if (success) return (
        <Mui.Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Mui.Paper elevation={0} sx={{ p: 4, maxWidth: 420, width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
                <Mui.Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <Icon.CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />
                </Mui.Box>
                <Mui.Typography variant="h6" fontWeight={800} mb={1}>Đặt lại mật khẩu thành công!</Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" mb={3}>
                    Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại.
                </Mui.Typography>
                <Mui.Button
                    variant="contained" fullWidth
                    onClick={() => navigate('/')}
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                >
                    Quay về trang chủ
                </Mui.Button>
            </Mui.Paper>
        </Mui.Box>
    )

    return (
        <Mui.Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Mui.Paper elevation={0} sx={{ p: 4, maxWidth: 420, width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Mui.Typography variant="h6" fontWeight={800} mb={1}>Đặt lại mật khẩu</Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" mb={3}>
                    Nhập mật khẩu mới cho tài khoản của bạn.
                </Mui.Typography>

                <Mui.Stack spacing={2} component="form" onSubmit={handleSubmit}>
                    <Mui.TextField
                        fullWidth size="small" label="Mật khẩu mới"
                        type={showPass ? 'text' : 'password'}
                        value={matKhauMoi}
                        onChange={e => { setMatKhauMoi(e.target.value); setError('') }}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <Mui.InputAdornment position="start">
                                    <Icon.LockOutlined fontSize="small" />
                                </Mui.InputAdornment>
                            ),
                            endAdornment: (
                                <Mui.InputAdornment position="end">
                                    <Mui.IconButton size="small" onClick={() => setShowPass(p => !p)}>
                                        {showPass ? <Icon.VisibilityOff fontSize="small" /> : <Icon.Visibility fontSize="small" />}
                                    </Mui.IconButton>
                                </Mui.InputAdornment>
                            )
                        }}
                    />
                    <Mui.TextField
                        fullWidth size="small" label="Xác nhận mật khẩu"
                        type={showPass ? 'text' : 'password'}
                        value={xacNhan}
                        onChange={e => { setXacNhan(e.target.value); setError('') }}
                        error={!!error}
                        helperText={error}
                        InputProps={{
                            startAdornment: (
                                <Mui.InputAdornment position="start">
                                    <Icon.LockOutlined fontSize="small" />
                                </Mui.InputAdornment>
                            )
                        }}
                    />

                    {/* Strength indicator */}
                    {matKhauMoi && (
                        <Mui.Box>
                            <Mui.LinearProgress
                                variant="determinate"
                                value={Math.min(100, matKhauMoi.length * 10)}
                                sx={{
                                    height: 4, borderRadius: 2,
                                    bgcolor: 'action.hover',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: matKhauMoi.length < 6 ? 'error.main'
                                            : matKhauMoi.length < 10 ? 'warning.main'
                                                : 'success.main'
                                    }
                                }}
                            />
                            <Mui.Typography variant="caption" color="text.disabled">
                                {matKhauMoi.length < 6 ? 'Quá ngắn'
                                    : matKhauMoi.length < 10 ? 'Trung bình'
                                        : 'Mạnh'}
                            </Mui.Typography>
                        </Mui.Box>
                    )}

                    <Mui.Button
                        type="submit" variant="contained" fullWidth size="large"
                        disabled={loading}
                        startIcon={loading ? <Mui.CircularProgress size={18} color="inherit" /> : <Icon.Lock />}
                        sx={{ fontWeight: 700, textTransform: 'none', mt: 1 }}
                    >
                        {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </Mui.Button>
                </Mui.Stack>
            </Mui.Paper>
        </Mui.Box>
    )
}

export default ResetPasswordPage