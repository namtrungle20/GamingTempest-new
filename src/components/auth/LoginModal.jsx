import React from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import { UI_SETTING } from '../../constants/theme/uiSetting';

const LoginModal = ({ open, handleClose, onSwitchRegister }) => {
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
        borderColor: 'primary.main', // Màu cam Tempest Gaming
      }}>
        {/* Header: Tiêu đề & Nút đóng */}
        <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Mui.Typography variant="h5" fontWeight={900}> ĐĂNG NHẬP </Mui.Typography>
          <Mui.IconButton onClick={handleClose}> <Icon.Close /> </Mui.IconButton>
        </Mui.Box>

        <Mui.Stack spacing={2.5}>
          {/* Inputs */}
          <Mui.TextField
            fullWidth
            label="Tên đăng nhập / Email"
            placeholder="gaming@tempest.com"
          />
          <Mui.TextField
            fullWidth
            label="Mật khẩu"
            type="password"
            InputProps={{
              endAdornment: (
                <Mui.InputAdornment position="end">
                  <Mui.IconButton><Icon.VisibilityOff /></Mui.IconButton>
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
            sx={{ fontWeight: 700, py: 1.5, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
          >
            ĐĂNG NHẬP NGAY
          </Mui.Button>

          <Mui.Divider sx={{ my: 1 }}> 
            <Mui.Typography variant="caption" color="text.secondary">HOẶC</Mui.Typography> 
          </Mui.Divider>

          {/* Social Logins */}
          <Mui.Stack direction="row" spacing={2}>
            <Mui.Button fullWidth variant="outlined" startIcon={<Icon.Google />}> Google </Mui.Button>
            <Mui.Button fullWidth variant="outlined" startIcon={<Icon.Facebook />}> Facebook </Mui.Button>
          </Mui.Stack>

          <Mui.Typography variant="body2" textAlign="center" mt={2}>
            Bạn chưa có tài khoản? {' '}
            <Mui.Typography
              component="span"
              onClick={onSwitchRegister}
              sx={{
                color: 'primary.main',
                fontWeight: 900,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
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