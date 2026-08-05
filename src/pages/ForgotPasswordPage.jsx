import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { authResetService } from '@/services/auth.service'

const ForgotPasswordPage = () => {
    const navigate = useNavigate()
    const [sdt, setSdt] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e?.preventDefault()
        if (!email.trim()) { setError('Vui lòng nhập email'); return }
        setLoading(true)
        setError('')
        const result = await authResetService.quenMatKhau({ email: email.trim() })
        setLoading(false)
        if (result.success) {
            setSubmitted(true)
        } else {
            setError(result.message)
        }
    }

    if (submitted) return (
        <Mui.Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Mui.Paper elevation={0} sx={{ p: 4, maxWidth: 420, width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
                <Mui.Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <Icon.MarkEmailRead sx={{ fontSize: 32, color: 'success.main' }} />
                </Mui.Box>
                <Mui.Typography variant="h6" fontWeight={800} mb={1}>Kiểm tra email của bạn</Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" mb={3}>
                    Nếu email <strong>{email}</strong> tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu tới email <strong>{email}</strong>.
                </Mui.Typography>
                <Mui.Typography variant="caption" color="text.disabled" display="block" mb={2}>
                    Không thấy email? Kiểm tra thư mục Spam.
                </Mui.Typography>
                <Mui.Button
                    variant="outlined" fullWidth
                    onClick={() => navigate('/')}
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                >
                    Quay lại trang chủ
                </Mui.Button>
            </Mui.Paper>
        </Mui.Box>
    )

    return (
        <Mui.Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Mui.Paper elevation={0} sx={{ p: 4, maxWidth: 420, width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <Mui.Box display="flex" alignItems="center" gap={1} mb={3}>
                    <Mui.IconButton size="small" onClick={() => navigate('/login')}>
                        <Icon.ArrowBack fontSize="small" />
                    </Mui.IconButton>
                    <Mui.Typography variant="h6" fontWeight={800}>Quên mật khẩu</Mui.Typography>
                </Mui.Box>

                <Mui.Typography variant="body2" color="text.secondary" mb={3}>
                    Nhập email để nhận link đặt lại mật khẩu.
                </Mui.Typography>

                <Mui.Stack spacing={2} component="form" onSubmit={handleSubmit}>
                    {/* <Mui.TextField
                        fullWidth size="small" label="Số điện thoại" type="tel"
                        value={sdt}
                        onChange={e => { setSdt(e.target.value); setError('') }}
                        error={!!error && !sdt.trim()}
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <Mui.InputAdornment position="start">
                                    <Icon.PhoneOutlined fontSize="small" />
                                </Mui.InputAdornment>
                            )
                        }}
                    /> */}
                    <Mui.TextField
                        fullWidth size="small" label="Email" type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        error={!!error && sdt.trim() && !email.trim()}
                        helperText={error}
                        InputProps={{
                            startAdornment: (
                                <Mui.InputAdornment position="start">
                                    <Icon.EmailOutlined fontSize="small" />
                                </Mui.InputAdornment>
                            )
                        }}
                    />
                    <Mui.Typography variant="caption" color="text.disabled">
                        Nếu tài khoản của bạn chưa từng liên kết email, email này sẽ được gắn vào tài khoản để nhận link đặt lại mật khẩu.
                    </Mui.Typography>
                    <Mui.Button
                        type="submit" variant="contained" fullWidth size="large"
                        disabled={loading}
                        startIcon={loading ? <Mui.CircularProgress size={18} color="inherit" /> : <Icon.Send />}
                        sx={{ fontWeight: 700, textTransform: 'none' }}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
                    </Mui.Button>
                </Mui.Stack>
            </Mui.Paper>
        </Mui.Box>
    )
}

export default ForgotPasswordPage