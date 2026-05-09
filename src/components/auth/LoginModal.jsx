import React, { useState } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import { UI_SETTING } from '../../theme/uiSetting';
import { useAuth } from '@/hook/provider/AuthProvider';

const LoginModal = ({ open, handleClose, onSwitchRegister }) => {
  const { login, loading, error, loginWithGoogle } = useAuth();
  const [loginKey, setLoginKey] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    const result = await login(loginKey, password);
    if (result.success) {
      handleClose();
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result.success) {
      handleClose();
    }
  };

  return (
    <Mui.Modal open={open} onClose={handleClose} closeAfterTransition>
      <Mui.Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: UI_SETTING.MODAL.WIDTH },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: UI_SETTING.MODAL.PADDING,
        borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
        outline: 'none',
        borderTop: '5px solid',
        borderColor: 'primary.main',
      }}>
        {/* Header */}
        <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Mui.Typography variant="h5" fontWeight={900}>ĐĂNG NHẬP</Mui.Typography>
          <Mui.IconButton onClick={handleClose}><Icon.Close /></Mui.IconButton>
        </Mui.Box>

        <Mui.Stack spacing={2.5}>
          {/* Hiển thị lỗi từ API */}
          {error && (
            <Mui.Alert severity="error" sx={{ borderRadius: UI_SETTING.SHAPE.CARD_RADIUS }}>
              {error}
            </Mui.Alert>
          )}

          <Mui.TextField
            fullWidth
            name='loginKey'
            label="Số điện thoại / Email"
            placeholder="gaming@tempest.com"
            value={loginKey}
            onChange={(e) => setLoginKey(e.target.value)}
          />

          <Mui.TextField
            fullWidth
            name='password'
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            InputProps={{
              endAdornment: (
                <Mui.InputAdornment position="end">
                  <Mui.IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Icon.Visibility /> : <Icon.VisibilityOff />}
                  </Mui.IconButton>
                </Mui.InputAdornment>
              ),
            }}
          />

          <Mui.Box textAlign="right">
            <Mui.Link href="#" variant="caption" color="primary" sx={{ fontWeight: 700, textDecoration: 'none' }}>
              Quên mật khẩu?
            </Mui.Link>
          </Mui.Box>

          <Mui.Button
            fullWidth

            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading || !loginKey || !password}
            sx={{ fontWeight: 700, py: 1.5, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
          >
            {loading ? <Mui.CircularProgress size={24} color="inherit" /> : 'ĐĂNG NHẬP NGAY'}
          </Mui.Button>

          <Mui.Divider sx={{ my: 1 }}>
            <Mui.Typography variant="caption" color="text.secondary">HOẶC</Mui.Typography>
          </Mui.Divider>

          <Mui.Stack direction="row" spacing={2}>
            <Mui.Button fullWidth variant="outlined" startIcon={<Icon.Google />} onClick={handleGoogleLogin} >Google</Mui.Button>
            <Mui.Button fullWidth variant="outlined" startIcon={<Icon.Facebook />}>Facebook</Mui.Button>
          </Mui.Stack>

          <Mui.Typography variant="body2" textAlign="center" mt={2}>
            Bạn chưa có tài khoản?{' '}
            <Mui.Typography
              component="span"
              onClick={onSwitchRegister}
              sx={{ color: 'primary.main', fontWeight: 900, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              ĐĂNG KÝ NGAY
            </Mui.Typography>
          </Mui.Typography>
        </Mui.Stack>
      </Mui.Box>
    </Mui.Modal>
  );
};

export default LoginModal;