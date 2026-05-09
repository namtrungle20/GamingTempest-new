import React, { useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '../../theme/uiSetting'
import { useAuth } from '@/hook/provider/AuthContext'

const RegisterModal = ({ open, handleClose, onSwitchLogin }) => {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sdt, setSdt] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    if (password !== confirmPassword) return;
    const result = await register(email, name, sdt, password);
    if (result.success) {
      handleClose();
      onSwitchLogin();
    }
  };

  return (
    <Mui.Modal open={open} onClose={handleClose} closeAfterTransition>
      <Mui.Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: 500 },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: UI_SETTING.MODAL.PADDING,
        borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
        outline: 'none',
        borderTop: '5px solid',
        borderColor: 'primary.main',
      }}>
        <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Mui.Typography variant="h5" fontWeight={900}>TẠO TÀI KHOẢN</Mui.Typography>
          <Mui.IconButton onClick={handleClose}><Icon.Close /></Mui.IconButton>
        </Mui.Box>

        <Mui.Typography variant="body2" color="text.secondary" mb={3}>
          Gia nhập cộng đồng Tempest Gaming để nhận ưu đãi độc quyền.
        </Mui.Typography>

        <Mui.Stack spacing={2}>
          {error && (
            <Mui.Alert severity="error" sx={{ borderRadius: UI_SETTING.SHAPE.CARD_RADIUS }}>
              {error}
            </Mui.Alert>
          )}

          <Mui.TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Mui.TextField
            fullWidth
            label="Email (Nếu có)"
            value={email}
            onChange={(e) => setName(e.target.value)}
          />


          <Mui.TextField
            fullWidth
            label="Số điện thoại"
            value={sdt}
            onChange={(e) => setSdt(e.target.value)}
          />

          <Mui.TextField
            fullWidth
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          <Mui.TextField
            fullWidth
            label="Xác nhận mật khẩu"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            error={confirmPassword.length > 0 && password !== confirmPassword}
            helperText={confirmPassword.length > 0 && password !== confirmPassword ? 'Mật khẩu không khớp' : ''}
            InputProps={{
              endAdornment: (
                <Mui.InputAdornment position="end">
                  <Mui.IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <Icon.Visibility /> : <Icon.VisibilityOff />}
                  </Mui.IconButton>
                </Mui.InputAdornment>
              ),
            }}
          />

          <Mui.Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading || !email || !sdt || !password || password !== confirmPassword}
            sx={{ fontWeight: 700, py: 1.5, mt: 1, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
          >
            {loading ? <Mui.CircularProgress size={24} color="inherit" /> : 'ĐĂNG KÝ NGAY'}
          </Mui.Button>

          {/* <Mui.Divider sx={{ my: 1 }}>
            <Mui.Typography variant="caption" color="text.secondary">HOẶC ĐĂNG KÝ BẰNG</Mui.Typography>
          </Mui.Divider> */}

          {/* <Mui.Stack direction="row" spacing={2}>
            <Mui.Button color="inherit" fullWidth variant="outlined" startIcon={<Icon.Google />}>Google</Mui.Button>
            <Mui.Button color="inherit" fullWidth variant="outlined" startIcon={<Icon.Facebook />}>Facebook</Mui.Button>
          </Mui.Stack> */}

          <Mui.Typography variant="body2" textAlign="center" mt={2}>
            Bạn đã có tài khoản?{' '}
            <Mui.Typography
              component="span"
              onClick={onSwitchLogin}
              sx={{ color: 'primary.main', fontWeight: 900, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              ĐĂNG NHẬP
            </Mui.Typography>
          </Mui.Typography>
        </Mui.Stack>
      </Mui.Box>
    </Mui.Modal>
  )
}

export default RegisterModal