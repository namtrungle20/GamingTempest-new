import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import * as MuiStyles from '@mui/material/styles'
import useChangePassword from '@/hook/user/useSetting'

// ── InfoTab ───────────────────────────────────────────────────────────────────

export const InfoTab = ({ form, saving, handleChange, handleSave }) => (
    <Mui.Stack spacing={2.5}>
        <Mui.TextField
            fullWidth label="Tên hiển thị"
            value={form.name}
            onChange={handleChange('name')}
            InputProps={{
                startAdornment: (
                    <Mui.InputAdornment position="start">
                        <Icon.PersonOutlineOutlined fontSize="small" />
                    </Mui.InputAdornment>
                )
            }}
        />
        <Mui.TextField
            fullWidth label="Email"
            value={form.email}
            onChange={handleChange('email')}
            InputProps={{
                startAdornment: (
                    <Mui.InputAdornment position="start">
                        <Icon.EmailOutlined fontSize="small" />
                    </Mui.InputAdornment>
                )
            }}
        />
        <Mui.TextField
            fullWidth label="Số điện thoại"
            value={form.sdt}
            onChange={handleChange('sdt')}
            InputProps={{
                startAdornment: (
                    <Mui.InputAdornment position="start">
                        <Icon.PhoneOutlined fontSize="small" />
                    </Mui.InputAdornment>
                )
            }}
        />
        <Mui.TextField
            fullWidth label="Địa chỉ"
            value={form.diachi}
            onChange={handleChange('diachi')}
            InputProps={{
                startAdornment: (
                    <Mui.InputAdornment position="start">
                        <Icon.LocationOnOutlined fontSize="small" />
                    </Mui.InputAdornment>
                )
            }}
        />
        <Mui.Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <Mui.CircularProgress size={16} color="inherit" /> : <Icon.SaveOutlined />}
            sx={{ fontWeight: 700, alignSelf: 'flex-end', px: 3 }}
        >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Mui.Button>
    </Mui.Stack>
)

// ── SettingsTab ───────────────────────────────────────────────────────────────

const PasswordField = ({ label, field, form, show, handleChange, toggleShow }) => (
    <Mui.TextField
        fullWidth
        label={label}
        type={show ? 'text' : 'password'}
        value={form[field]}
        onChange={handleChange(field)}
        error={field === 'xacNhan' && form.xacNhan.length > 0 && form.xacNhan !== form.matKhauMoi}
        helperText={field === 'xacNhan' && form.xacNhan.length > 0 && form.xacNhan !== form.matKhauMoi
            ? 'Mật khẩu không khớp' : ''}
        InputProps={{
            startAdornment: (
                <Mui.InputAdornment position="start">
                    <Icon.LockOutlined fontSize="small" />
                </Mui.InputAdornment>
            ),
            endAdornment: (
                <Mui.InputAdornment position="end">
                    <Mui.IconButton size="small" onClick={() => toggleShow(field === 'matKhauCu' ? 'cu' : field === 'matKhauMoi' ? 'moi' : 'xacNhan')}>
                        {show ? <Icon.VisibilityOff fontSize="small" /> : <Icon.Visibility fontSize="small" />}
                    </Mui.IconButton>
                </Mui.InputAdornment>
            )
        }}
    />
)

export const SettingsTab = () => {
    const { form, show, saving, handleChange, toggleShow, handleSave } = useChangePassword()
    // const { mode, setMode } = MuiStyles.useColorScheme()

    return (
        <Mui.Stack spacing={3}>
            {/* Đổi mật khẩu */}
            <Mui.Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
                <Mui.Typography variant="subtitle2" fontWeight={700} mb={2}>
                    Đổi mật khẩu
                </Mui.Typography>
                <Mui.Stack spacing={2}>
                    <PasswordField
                        label="Mật khẩu hiện tại" field="matKhauCu"
                        form={form} show={show.cu}
                        handleChange={handleChange} toggleShow={toggleShow}
                    />
                    <PasswordField
                        label="Mật khẩu mới" field="matKhauMoi"
                        form={form} show={show.moi}
                        handleChange={handleChange} toggleShow={toggleShow}
                    />
                    <PasswordField
                        label="Xác nhận mật khẩu mới" field="xacNhan"
                        form={form} show={show.xacNhan}
                        handleChange={handleChange} toggleShow={toggleShow}
                    />
                    <Mui.Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={saving}
                        startIcon={saving ? <Mui.CircularProgress size={16} color="inherit" /> : <Icon.SaveOutlined />}
                        sx={{ fontWeight: 700, alignSelf: 'flex-end', px: 3 }}
                    >
                        {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
                    </Mui.Button>
                </Mui.Stack>
            </Mui.Paper>


            {/* <Mui.Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5 }}>
                <Mui.Typography variant="subtitle2" fontWeight={700} mb={2}>Giao diện</Mui.Typography>
                <Mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Mui.Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {mode === 'dark'
                            ? <Icon.DarkModeOutlined fontSize="small" color="primary" />
                            : <Icon.LightModeOutlined fontSize="small" color="primary" />
                        }
                        <Mui.Box>
                            <Mui.Typography variant="body2" fontWeight={600}>Chế độ tối</Mui.Typography>
                            <Mui.Typography variant="caption" color="text.secondary">
                                {mode === 'dark' ? 'Đang bật' : 'Đang tắt'}
                            </Mui.Typography>
                        </Mui.Box>
                    </Mui.Box>
                    <Mui.Switch
                        checked={mode === 'dark'}
                        onChange={() => setMode(mode === 'dark' ? 'light' : 'dark')}
                        color="primary"
                    />
                </Mui.Box>
            </Mui.Paper> */}
        </Mui.Stack>
    )
}