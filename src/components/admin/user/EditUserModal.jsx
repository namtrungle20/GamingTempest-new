import { useState, useEffect } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'
import { ROLE_OPTIONS, LOCK_OPTIONS } from '@/constants/UserConstants'

const EditUserModal = ({ open, user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        id: '',
        email: '',
        sdt: '',
        vaitro: 2,
        isLock: false,
    })

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                email: user.email || '',
                sdt: user.sdt || '',
                vaitro: user.vaitro,
                isLock: user.isLock,
            })
        }
    }, [user])

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = () => {
        onSave({
            id: formData.id,
            email: formData.email,
            sdt: formData.sdt,
            vaitro: formData.vaitro,
            is_lock: formData.isLock ? 1 : 0,
        })
    }

    return (
        <Mui.Modal open={open} onClose={onClose} closeAfterTransition>
            <Mui.Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
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
                    <Mui.Typography variant="h5" fontWeight={700}>
                        Chỉnh sửa người dùng
                    </Mui.Typography>
                    <Mui.IconButton onClick={onClose} size="small">
                        <Icon.Close />
                    </Mui.IconButton>
                </Mui.Box>

                {/* Form */}
                <Mui.Stack spacing={2.5}>
                    <Mui.TextField
                        fullWidth
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        variant="outlined"
                    />

                    <Mui.TextField
                        fullWidth
                        label="Số điện thoại"
                        value={formData.sdt}
                        onChange={(e) => handleChange('sdt', e.target.value)}
                        variant="outlined"
                    />

                    <Mui.FormControl fullWidth>
                        <Mui.InputLabel>Vai trò</Mui.InputLabel>
                        <Mui.Select
                            value={formData.vaitro}
                            label="Vai trò"
                            onChange={(e) => handleChange('vaitro', e.target.value)}
                        >
                            {ROLE_OPTIONS.map(opt => (
                                <Mui.MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </Mui.MenuItem>
                            ))}
                        </Mui.Select>
                    </Mui.FormControl>

                    <Mui.FormControl fullWidth>
                        <Mui.InputLabel>Trạng thái</Mui.InputLabel>
                        <Mui.Select
                            value={formData.isLock ? 1 : 0}
                            label="Trạng thái"
                            onChange={(e) => handleChange('isLock', e.target.value === 1)}
                        >
                            {LOCK_OPTIONS.map(opt => (
                                <Mui.MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </Mui.MenuItem>
                            ))}
                        </Mui.Select>
                    </Mui.FormControl>
                </Mui.Stack>

                {/* Actions */}
                <Mui.Box display="flex" gap={2} mt={4}>
                    <Mui.Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        sx={{ borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
                    >
                        Hủy
                    </Mui.Button>
                    <Mui.Button
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
                    >
                        Lưu thay đổi
                    </Mui.Button>
                </Mui.Box>
            </Mui.Box>
        </Mui.Modal>
    )
}

export default EditUserModal