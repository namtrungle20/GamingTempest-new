import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'

const FEATURES = [
    {
        icon: <Icon.LocalShipping sx={{ fontSize: 32 }} />,
        title: 'Giao hàng toàn quốc',
        desc: 'Miễn phí cho đơn từ 500K',
        color: 'primary.main',
    },
    {
        icon: <Icon.VerifiedUser sx={{ fontSize: 32 }} />,
        title: 'Hàng chính hãng 100%',
        desc: 'Cam kết bảo hành đầy đủ',
        color: 'success.main',
    },
    {
        icon: <Icon.SupportAgent sx={{ fontSize: 32 }} />,
        title: 'Hỗ trợ 24/7',
        desc: 'Tư vấn nhiệt tình, tận tâm',
        color: 'info.main',
    },
    {
        icon: <Icon.Replay sx={{ fontSize: 32 }} />,
        title: 'Đổi trả dễ dàng',
        desc: 'Trong vòng 7 ngày',
        color: 'warning.main',
    },
]

const FeatureBanner = () => (
    <Mui.Grid container spacing={2} sx={{ py: 2 }}>
        {FEATURES.map((f, i) => (
            <Mui.Grid item xs={6} md={3} key={i}>
                <Mui.Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        height: '100%',
                        transition: 'border-color 0.2s',
                        '&:hover': { borderColor: f.color }
                    }}
                >
                    <Mui.Box sx={{ color: f.color, flexShrink: 0 }}>{f.icon}</Mui.Box>
                    <Mui.Box>
                        <Mui.Typography variant="body2" fontWeight={800}>{f.title}</Mui.Typography>
                        <Mui.Typography variant="caption" color="text.secondary">{f.desc}</Mui.Typography>
                    </Mui.Box>
                </Mui.Paper>
            </Mui.Grid>
        ))}
    </Mui.Grid>
)

export default FeatureBanner