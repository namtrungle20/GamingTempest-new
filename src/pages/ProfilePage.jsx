import { useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import useProfile from '../hook/user/useProfile'
import useMemberStats from '../hook/user/useMemberStats'
import MemberCard from '../components/card/MemberCard'
import { InfoTab, SettingsTab } from '../components/profile/ProfileTabs'


const ProfilePage = () => {
    const { user, form, saving, handleChange, handleSave } = useProfile()
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const { totalSpent, orderCount, loading: statsLoading } = useMemberStats()
    const [tab, setTab] = useState(0)

    const showSuccess = (message) => setSnackbar({ open: true, message, severity: 'success' })
    const showError = (message) => setSnackbar({ open: true, message, severity: 'error' })


    return (
        <Mui.Container maxWidth="sm" sx={{ py: 4 }}>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>

                {/* Header */}
                <Mui.Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3 }}>
                    <Mui.Avatar sx={{
                        width: 64, height: 64,
                        bgcolor: 'primary.main',
                        fontSize: '1.5rem', fontWeight: 800
                    }}>
                        {(user?.name || user?.email || 'U')[0].toUpperCase()}
                    </Mui.Avatar>
                    <Mui.Box>
                        <Mui.Typography variant="h5" fontWeight={800}>
                            {user?.name || user?.email?.split('@')[0] || 'Người dùng'}
                        </Mui.Typography>
                        <Mui.Typography variant="body2" color="text.secondary">
                            {user?.email || user?.sdt || ''}
                        </Mui.Typography>
                    </Mui.Box>
                </Mui.Box>

                {/* Member card */}
                <MemberCard
                    totalSpent={totalSpent}
                    orderCount={orderCount}
                    loading={statsLoading}
                />

                {/* Quick link đơn hàng */}
                <Mui.Paper
                    variant="outlined"
                    component={RouterLink}
                    to="/donhang"
                    sx={{
                        borderRadius: 2, p: 2, mb: 3,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        textDecoration: 'none', color: 'inherit',
                        '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                        transition: 'all 0.15s'
                    }}
                >
                    <Mui.Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Icon.ShoppingBagOutlined color="primary" />
                        <Mui.Box>
                            <Mui.Typography variant="body2" fontWeight={700}>Lịch sử đơn hàng</Mui.Typography>
                            <Mui.Typography variant="caption" color="text.secondary">
                                {statsLoading ? '...' : `${orderCount} đơn hàng`}
                            </Mui.Typography>
                        </Mui.Box>
                    </Mui.Box>
                    <Icon.ChevronRight color="action" />
                </Mui.Paper>

                {/* Tabs */}
                <Mui.Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                    <Mui.Tab
                        label="Thông tin"
                        icon={<Icon.PersonOutlineOutlined />}
                        iconPosition="start"
                        sx={{ fontWeight: 700 }}
                    />
                    <Mui.Tab
                        label="Cài đặt"
                        icon={<Icon.SettingsOutlined />}
                        iconPosition="start"
                        sx={{ fontWeight: 700 }}
                    />
                </Mui.Tabs>

                {tab === 0 && (
                    <motion.div key="info" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <InfoTab
                            form={form}
                            saving={saving}
                            handleChange={handleChange}
                            handleSave={handleSave}
                        />
                    </motion.div>
                )}
                {tab === 1 && (
                    <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <SettingsTab />
                    </motion.div>
                )}

            </motion.div>

            <Mui.Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Mui.Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Mui.Alert>
            </Mui.Snackbar>

        </Mui.Container>
    )
}

export default ProfilePage
