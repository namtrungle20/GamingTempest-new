import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { HANG_CONFIG, formatTienNgan } from '@/constants/rankConstants'

const RankPolicyPage = () => {
    const ranks = Object.entries(HANG_CONFIG) // [ ['0', {...}], ['1', {...}], ... ]

    return (
        <Mui.Container maxWidth="md" sx={{ py: 6 }}>
            <Mui.Typography variant="h4" fontWeight={900} gutterBottom>
                Hạng thành viên & Ưu đãi
            </Mui.Typography>
            <Mui.Typography color="text.secondary" sx={{ mb: 4 }}>
                Tổng chi tiêu tích luỹ của bạn càng cao, hạng thành viên càng lên cao, đi kèm mức ưu đãi phí vận chuyển tương ứng cho các đơn hàng tiếp theo.
            </Mui.Typography>

            <Mui.Stack spacing={2} sx={{ mb: 5 }}>
                {ranks.map(([key, r]) => {
                    const IconComponent = Icon[r.icon]
                    return (
                        <Mui.Paper
                            key={key}
                            variant="outlined"
                            sx={{
                                p: 2.5, borderRadius: 2,
                                display: 'flex', alignItems: 'center', gap: 2,
                                bgcolor: r.bgColor,
                                borderColor: r.color,
                            }}
                        >
                            <Mui.Box sx={{ color: r.color, display: 'flex' }}>
                                {IconComponent && <IconComponent sx={{ fontSize: 32 }} />}
                            </Mui.Box>
                            <Mui.Box sx={{ flex: 1 }}>
                                <Mui.Typography fontWeight={800}>{r.label}</Mui.Typography>
                                <Mui.Typography variant="body2" color="text.secondary">
                                    {r.dieuKien === 0
                                        ? 'Mặc định khi đăng ký tài khoản'
                                        : `Tổng chi tiêu từ ${formatTienNgan(r.dieuKien)}`}
                                </Mui.Typography>
                            </Mui.Box>
                            <Mui.Chip
                                label={r.giamShip > 0 ? `Giảm ${r.giamShip}% phí ship` : 'Không có ưu đãi'}
                                sx={{ bgcolor: r.color, color: 'white', fontWeight: 700 }}
                            />
                        </Mui.Paper>
                    )
                })}
            </Mui.Stack>

            <Mui.Typography variant="h6" fontWeight={800} gutterBottom>
                Quy trình leo hạng
            </Mui.Typography>
            <Mui.Stack spacing={1.5} component="ol" sx={{ pl: 3, color: 'text.secondary' }}>
                <Mui.Typography component="li" variant="body2">
                    Mỗi đơn hàng thanh toán thành công sẽ được cộng dồn vào tổng chi tiêu của tài khoản.
                </Mui.Typography>
                <Mui.Typography component="li" variant="body2">
                    Hạng thành viên tự động cập nhật ngay khi tổng chi tiêu đạt mốc yêu cầu, không cần đăng ký thủ công.
                </Mui.Typography>
                <Mui.Typography component="li" variant="body2">
                    Ưu đãi giảm phí vận chuyển theo hạng được áp dụng tự động ở bước thanh toán cho các đơn hàng tiếp theo.
                </Mui.Typography>
                <Mui.Typography component="li" variant="body2">
                    Hạng thành viên được giữ nguyên vĩnh viễn, không bị hạ hạng theo thời gian.
                </Mui.Typography>
            </Mui.Stack>
        </Mui.Container>
    )
}

export default RankPolicyPage