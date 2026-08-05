import React, { useState, useEffect } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '../../theme/uiSetting'

const VerifyOtpModal = ({ open, handleClose, onVerify, onResend, loading, error, onVerified }) => {
    const [otp, setOtp] = useState('');
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleVerify = async () => {
        const result = await onVerify(otp);
        if (result.success) onVerified();
    };

    const handleResend = async () => {
        const result = await onResend();
        if (result.success) setCooldown(60);
    };

    return (
        <Mui.Modal open={open} onClose={handleClose} closeAfterTransition>
            <Mui.Box sx={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '95%', sm: 420 },
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: UI_SETTING.MODAL.PADDING,
                borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
                outline: 'none',
                borderTop: '5px solid',
                borderColor: 'primary.main',
            }}>
                <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Mui.Typography variant="h5" fontWeight={900}>XÁC THỰC EMAIL</Mui.Typography>
                    <Mui.IconButton onClick={handleClose}><Icon.Close /></Mui.IconButton>
                </Mui.Box>

                <Mui.Typography variant="body2" color="text.secondary" mb={3}>
                    Nhập mã OTP 6 số vừa được gửi đến email của bạn.
                </Mui.Typography>

                <Mui.Stack spacing={2}>
                    {error && (
                        <Mui.Alert severity="error" sx={{ borderRadius: UI_SETTING.SHAPE.CARD_RADIUS }}>
                            {error}
                        </Mui.Alert>
                    )}

                    <Mui.TextField
                        fullWidth
                        label="Mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                        inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                    />

                    <Mui.Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleVerify}
                        disabled={loading || otp.length !== 6}
                        sx={{ fontWeight: 700, py: 1.5, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
                    >
                        {loading ? <Mui.CircularProgress size={24} color="inherit" /> : 'XÁC NHẬN'}
                    </Mui.Button>

                    <Mui.Typography variant="body2" textAlign="center" mt={1}>
                        Không nhận được mã?{' '}
                        <Mui.Typography
                            component="span"
                            onClick={cooldown > 0 ? undefined : handleResend}
                            sx={{
                                color: cooldown > 0 ? 'text.disabled' : 'primary.main',
                                fontWeight: 900,
                                cursor: cooldown > 0 ? 'default' : 'pointer',
                                '&:hover': cooldown > 0 ? {} : { textDecoration: 'underline' },
                            }}
                        >
                            {cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại mã'}
                        </Mui.Typography>
                    </Mui.Typography>
                </Mui.Stack>
            </Mui.Box>
        </Mui.Modal>
    )
}

export default VerifyOtpModal