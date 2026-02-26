import React from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '../../theme/uiSetting'

const RegisterModal = ({ open, handleClose, onSwitchLogin }) => {
  return (
    <Mui.Modal open={open} onClose={handleClose} closeAfterTransition>
      <Mui.Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '95%', sm: 500 }, // Đăng ký cần rộng hơn chút vì nhiều field
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: UI_SETTING.MODAL.PADDING,
        borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
        outline: 'none',
        borderTop: '5px solid',
        borderColor: 'primary.main',
      }}>
        {/* Header */}
        <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Mui.Typography variant="h5" fontWeight={900}> TẠO TÀI KHOẢN </Mui.Typography>
          <Mui.IconButton onClick={handleClose}> <Icon.Close /> </Mui.IconButton>
        </Mui.Box>

        <Mui.Typography variant="body2" color="text.secondary" mb={3}>
          Gia nhập cộng đồng Tempest Gaming để nhận ưu đãi độc quyền.
        </Mui.Typography>

        <Mui.Stack spacing={2}>
          <Mui.Stack direction="row" spacing={2}>
            <Mui.TextField fullWidth label="Họ" variant="outlined" />
            <Mui.TextField fullWidth label="Tên" variant="outlined" />
          </Mui.Stack>

          <Mui.TextField fullWidth label="Số điện thoại / Email" variant="outlined" />

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

          <Mui.Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ fontWeight: 700, py: 1.5, mt: 1, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
          >
            ĐĂNG KÝ NGAY
          </Mui.Button>

          <Mui.Divider sx={{ my: 1 }}> 
            <Mui.Typography variant="caption" color="text.secondary">HOẶC ĐĂNG KÝ BẰNG</Mui.Typography> 
          </Mui.Divider>

          <Mui.Stack direction="row" spacing={2}>
            <Mui.Button color="inherit" fullWidth variant="outlined" startIcon={<Icon.Google />}> Google </Mui.Button>
            <Mui.Button color="inherit" fullWidth variant="outlined" startIcon={<Icon.Facebook />}> Facebook </Mui.Button>
          </Mui.Stack>

          <Mui.Typography variant="body2" textAlign="center" mt={2}>
            Bạn đã có tài khoản? {' '}
            <Mui.Typography
              component="span"
              onClick={onSwitchLogin}
              sx={{
                color: 'primary.main',
                fontWeight: 900,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
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