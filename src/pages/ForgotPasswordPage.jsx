import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { authResetService } from '@/services/auth.service'

const STRENGTH = (len) => {
    if (len < 6) return { value: len * 10, color: 'error.main', label: 'Quá ngắn' }
    if (len < 10) return { value: len * 8, color: 'warning.main', label: 'Trung bình' }
    return { value: 100, color: 'success.main', label: 'Mạnh' }
}

const ForgotPasswordPage = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [matKhauMoi, setMatKhauMoi] = useState('')
    const [xacNhan, setXacNhan] = useState('')
    const [showPass, setShowPass] = useState(false)

    const [step, setStep] = useState(1) // 1 | 2 | 3
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [cooldown, setCooldown] = useState(0)

    const startCooldown = (seconds = 60) => {
        setCooldown(seconds)
        const interval = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0 }
                return prev - 1
            })
        }, 1000)
    }

    const handleGuiOtp = async (e) => {
        e?.preventDefault()
        if (!email.trim()) { setError('Vui lòng nhập email'); return }
        setLoading(true)
        setError('')
        const result = await authResetService.quenMatKhauYeuCau(email.trim())
        setLoading(false)
        if (result.success) {
            setStep(2)
            startCooldown(60)
        } else {
            setError(result.message)
        }
    }

    const handleGuiLai = async () => {
        if (cooldown > 0) return
        setLoading(true)
        setError('')
        const result = await authResetService.quenMatKhauYeuCau(email.trim())
        setLoading(false)
        if (result.success) {
            startCooldown(60)
        } else {
            setError(result.message)
        }
    }

    const handleDatLai = async (e) => {
        e?.preventDefault()
        if (!otp.trim()) { setError('Vui lòng nhập mã OTP'); return }
        if (!matKhauMoi || matKhauMoi.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return }
        if (matKhauMoi !== xacNhan) { setError('Mật khẩu xác nhận không khớp'); return }
        setLoading(true)
        setError('')
        const result = await authResetService.quenMatKhauXacThuc(email.trim(), otp.trim(), matKhauMoi)
        setLoading(false)
        if (result.success) {
            setStep(3)
        } else {
            setError(result.message)
        }
    }

    const strength = STRENGTH(matKhauMoi.length)

    // ── Step 3: Thành công ──
    if (step === 3) return (
        <Mui.Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Mui.Paper elevation={0} sx={{ p: 4, maxWidth: 420, width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3, textAlign: 'center' }}>
                <Mui.Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <Icon.CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />
                </Mui.Box>
                <Mui.Typography variant="h6" fontWeight={800} mb={1}>Đặt lại mật khẩu thành công!</Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" mb={3}>
                    Mật khẩu đã được cập nhật. Vui lòng đăng nhập lại.
                </Mui.Typography>
                <Mui.Button
                    variant="contained" fullWidth
                    onClick={() => {
                        navigate('/')
                        setTimeout(() => window.dispatchEvent(new Event('open-login-modal')), 300)
                    }}
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                >
                    Đăng nhập ngay
                </Mui.Button>
            </Mui.Paper>
        </Mui.Box>
    )

    return (
        <Mui.Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
            <Mui.Paper elevation={0} sx={{ p: 4, maxWidth: 420, width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>

                {/* Header */}
                <Mui.Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Mui.IconButton size="small" onClick={() => step === 2 ? (setStep(1), setError('')) : navigate('/login')}>
                        <Icon.ArrowBack fontSize="small" />
                    </Mui.IconButton>
                    <Mui.Typography variant="h6" fontWeight={800}>Quên mật khẩu</Mui.Typography>
                </Mui.Box>

                {/* Stepper */}
                <Mui.Stepper activeStep={step - 1} sx={{ mb: 3 }}>
                    <Mui.Step><Mui.StepLabel>Nhập email</Mui.StepLabel></Mui.Step>
                    <Mui.Step><Mui.StepLabel>Xác thực OTP</Mui.StepLabel></Mui.Step>
                </Mui.Stepper>

                {/* ── Step 1 ── */}
                {step === 1 && (
                    <Mui.Stack spacing={2} component="form" onSubmit={handleGuiOtp}>
                        <Mui.Typography variant="body2" color="text.secondary">
                            Nhập email để nhận mã OTP đặt lại mật khẩu.
                        </Mui.Typography>
                        <Mui.TextField
                            fullWidth size="small" label="Email" type="email"
                            value={email} autoFocus
                            onChange={e => { setEmail(e.target.value); setError('') }}
                            error={!!error}
                            helperText={error}
                            InputProps={{
                                startAdornment: (
                                    <Mui.InputAdornment position="start">
                                        <Icon.EmailOutlined fontSize="small" />
                                    </Mui.InputAdornment>
                                )
                            }}
                        />
                        <Mui.Button
                            type="submit" variant="contained" fullWidth size="large"
                            disabled={loading}
                            startIcon={loading ? <Mui.CircularProgress size={18} color="inherit" /> : <Icon.Send />}
                            sx={{ fontWeight: 700, textTransform: 'none' }}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                        </Mui.Button>
                    </Mui.Stack>
                )}

                {/* ── Step 2 ── */}
                {step === 2 && (
                    <Mui.Stack spacing={2} component="form" onSubmit={handleDatLai}>
                        <Mui.Typography variant="body2" color="text.secondary">
                            Mã OTP đã gửi tới <strong>{email}</strong>. Nhập mã và mật khẩu mới.
                        </Mui.Typography>

                        <Mui.TextField
                            fullWidth size="small" label="Mã OTP"
                            value={otp} autoFocus
                            onChange={e => { setOtp(e.target.value); setError('') }}
                            inputProps={{ maxLength: 6 }}
                            InputProps={{
                                startAdornment: (
                                    <Mui.InputAdornment position="start">
                                        <Icon.Pin fontSize="small" />
                                    </Mui.InputAdornment>
                                )
                            }}
                        />

                        <Mui.TextField
                            fullWidth size="small" label="Mật khẩu mới"
                            type={showPass ? 'text' : 'password'}
                            value={matKhauMoi}
                            onChange={e => { setMatKhauMoi(e.target.value); setError('') }}
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

                        {matKhauMoi && (
                            <Mui.Box>
                                <Mui.LinearProgress
                                    variant="determinate"
                                    value={strength.value}
                                    sx={{
                                        height: 4, borderRadius: 2,
                                        bgcolor: 'action.hover',
                                        '& .MuiLinearProgress-bar': { bgcolor: strength.color }
                                    }}
                                />
                                <Mui.Typography variant="caption" color="text.disabled">
                                    {strength.label}
                                </Mui.Typography>
                            </Mui.Box>
                        )}

                        <Mui.TextField
                            fullWidth size="small" label="Xác nhận mật khẩu"
                            type={showPass ? 'text' : 'password'}
                            value={xacNhan}
                            onChange={e => { setXacNhan(e.target.value); setError('') }}
                            error={!!error || (xacNhan.length > 0 && xacNhan !== matKhauMoi)}
                            helperText={error || (xacNhan.length > 0 && xacNhan !== matKhauMoi ? 'Mật khẩu không khớp' : '')}
                            InputProps={{
                                startAdornment: (
                                    <Mui.InputAdornment position="start">
                                        <Icon.LockOutlined fontSize="small" />
                                    </Mui.InputAdornment>
                                )
                            }}
                        />

                        <Mui.Button
                            type="submit" variant="contained" fullWidth size="large"
                            disabled={loading}
                            startIcon={loading ? <Mui.CircularProgress size={18} color="inherit" /> : <Icon.Lock />}
                            sx={{ fontWeight: 700, textTransform: 'none' }}
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </Mui.Button>

                        <Mui.Box textAlign="center">
                            <Mui.Typography variant="caption" color="text.secondary">
                                Không nhận được mã?{' '}
                                <Mui.Link
                                    component="button" type="button" variant="caption"
                                    onClick={handleGuiLai}
                                    disabled={cooldown > 0}
                                    sx={{ fontWeight: 700, cursor: cooldown > 0 ? 'default' : 'pointer' }}
                                >
                                    {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại'}
                                </Mui.Link>
                            </Mui.Typography>
                        </Mui.Box>
                    </Mui.Stack>
                )}
            </Mui.Paper>
        </Mui.Box>
    )
}

export default ForgotPasswordPage