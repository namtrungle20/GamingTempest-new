import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import useMemberRank from '@/hook/user/useMemberRank'
import { getHangConfig } from '@/constants/rankConstants'

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

const ICON_MAP = {
    0: '⚪️',
    1: '🔘',
    2: '🏆',
    3: '♦️',
}


const MemberCard = ({ orderCount = 0 }) => {
    const {
        hangthanhvien, label, tong_chi_tieu,
        labelTiepTheo, conThieu, phanTramTienDo,
        loading,
    } = useMemberRank()

    if (loading) return <Mui.Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2, mb: 2 }} />

    const config = getHangConfig(hangthanhvien)
    const icon = ICON_MAP[hangthanhvien] || '⚪️'

    return (
        <Mui.Paper
            variant="outlined"
            sx={{
                borderRadius: 2, p: 2.5, mb: 2,
                background: `linear-gradient(135deg, ${config.color}18 0%, transparent 60%)`,
                borderColor: config.color,
            }}
        >
            <Mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Mui.Box>
                    <Mui.Typography variant="caption" color="text.secondary" fontWeight={600}
                        sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        Hạng thành viên
                    </Mui.Typography>
                    <Mui.Typography variant="h5" fontWeight={800} sx={{ color: config.color }}>
                        {icon} {label}
                    </Mui.Typography>
                </Mui.Box>
                <Mui.Box sx={{ textAlign: 'right' }}>
                    <Mui.Typography variant="caption" color="text.secondary">Tổng chi tiêu</Mui.Typography>
                    <Mui.Typography variant="subtitle1" fontWeight={800} color="primary.main">
                        {fmt(tong_chi_tieu)}
                    </Mui.Typography>
                </Mui.Box>
            </Mui.Box>

            {/* Progress lên hạng tiếp theo — nếu đã ở hạng cao nhất thì labelTiepTheo = null */}
            {labelTiepTheo ? (
                <Mui.Box mb={2}>
                    <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Mui.Typography variant="caption" color="text.secondary">{label}</Mui.Typography>
                        <Mui.Typography variant="caption" color="text.secondary">
                            {labelTiepTheo} — còn {fmt(conThieu)}
                        </Mui.Typography>
                    </Mui.Box>
                    <Mui.LinearProgress
                        variant="determinate"
                        value={phanTramTienDo}
                        sx={{
                            height: 8, borderRadius: 4,
                            bgcolor: 'action.hover',
                            '& .MuiLinearProgress-bar': { bgcolor: config.color, borderRadius: 4 }
                        }}
                    />
                </Mui.Box>
            ) : (
                <Mui.Box mb={2} sx={{
                    p: 1.5, borderRadius: 1.5, textAlign: 'center',
                    bgcolor: config.bgColor,
                }}>
                    <Mui.Typography variant="caption" fontWeight={700} sx={{ color: config.color }}>
                        🎉 Bạn đang ở hạng cao nhất!
                    </Mui.Typography>
                </Mui.Box>
            )}

            <Mui.Box sx={{ display: 'flex', gap: 2 }}>
                <Mui.Box sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Mui.Typography variant="h6" fontWeight={800}>{orderCount}</Mui.Typography>
                    <Mui.Typography variant="caption" color="text.secondary">Đơn hàng</Mui.Typography>
                </Mui.Box>
                <Mui.Box sx={{ flex: 1, textAlign: 'center', p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                    <Mui.Typography variant="h6" fontWeight={800} sx={{ color: config.color }}>{icon}</Mui.Typography>
                    <Mui.Typography variant="caption" color="text.secondary">Hạng hiện tại</Mui.Typography>
                </Mui.Box>
            </Mui.Box>
        </Mui.Paper>
    )
}

export default MemberCard