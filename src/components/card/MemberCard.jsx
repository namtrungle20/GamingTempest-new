import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

export const MEMBER_TIERS = [
    { label: 'Đồng', min: 0, max: 2999999, color: '#9e9e9e', icon: '⚪️' },
    { label: 'Bạc', min: 3000000, max: 5999999, color: '#757575', icon: '🔘' },
    { label: 'Vàng', min: 6000000, max: 9999999, color: '#fbc02d', icon: '🏆' },
    { label: 'Bạch Kim', min: 10000000, max: 19999999, color: '#00bcd4', icon: '💎' },
    { label: 'Kim Cương', min: 20000000, max: Infinity, color: '#8c72f4', icon: '♦️' },
]

const getTier = (amount) =>
    MEMBER_TIERS.findLast(t => amount >= t.min) || MEMBER_TIERS[0]

const getProgress = (amount) => {
    const tier = getTier(amount)
    const idx = MEMBER_TIERS.indexOf(tier)
    if (idx === 0) return (amount / MEMBER_TIERS[1].min) * 100
    const prev = MEMBER_TIERS[idx - 1]
    return Math.min(((amount - prev.min) / (tier.min - prev.min)) * 100, 100)
}

const MemberCard = ({ totalSpent, orderCount, loading }) => {
    const tier = getTier(totalSpent)
    const progress = getProgress(totalSpent)
    const nextTier = MEMBER_TIERS[MEMBER_TIERS.indexOf(tier) + 1]

    if (loading) return <Mui.Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 2 }} />

    return (
        <Mui.Paper
            variant="outlined"
            sx={{
                borderRadius: 2, p: 2.5, mb: 2,
                background: `linear-gradient(135deg, ${tier.color}18 0%, transparent 60%)`,
                borderColor: tier.color,
            }}
        >
            <Mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Mui.Box>
                    <Mui.Typography variant="caption" color="text.secondary" fontWeight={600}
                        sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Hạng thành viên
                    </Mui.Typography>
                    <Mui.Typography variant="h5" fontWeight={800} sx={{ color: tier.color }}>
                        {tier.icon} {tier.label}
                    </Mui.Typography>
                </Mui.Box>
                <Mui.Box sx={{ textAlign: 'right' }}>
                    <Mui.Typography variant="caption" color="text.secondary">Tổng chi tiêu</Mui.Typography>
                    <Mui.Typography variant="subtitle1" fontWeight={800} color="primary.main">
                        {fmt(totalSpent)}
                    </Mui.Typography>
                </Mui.Box>
            </Mui.Box>

            {nextTier && (
                <Mui.Box mb={2}>
                    <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Mui.Typography variant="caption" color="text.secondary">{tier.label}</Mui.Typography>
                        <Mui.Typography variant="caption" color="text.secondary">
                            {nextTier.icon} {nextTier.label} — còn {fmt(nextTier.min - totalSpent)}
                        </Mui.Typography>
                    </Mui.Box>
                    <Mui.LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 8, borderRadius: 4,
                            bgcolor: 'action.hover',
                            '& .MuiLinearProgress-bar': { bgcolor: tier.color, borderRadius: 4 }
                        }}
                    />
                </Mui.Box>
            )}

            <Mui.Box sx={{ display: 'flex', gap: 2 }}>
                <Mui.Box sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Mui.Typography variant="h6" fontWeight={800}>{orderCount}</Mui.Typography>
                    <Mui.Typography variant="caption" color="text.secondary">Đơn hàng</Mui.Typography>
                </Mui.Box>
                <Mui.Box sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Mui.Typography variant="h6" fontWeight={800} sx={{ color: tier.color }}>{tier.icon}</Mui.Typography>
                    <Mui.Typography variant="caption" color="text.secondary">Hạng hiện tại</Mui.Typography>
                </Mui.Box>
            </Mui.Box>
        </Mui.Paper>
    )
}

export default MemberCard