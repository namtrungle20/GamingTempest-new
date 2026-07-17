import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { Link } from 'react-router-dom'

const FEATURES = [
    {
        icon: <Icon.MilitaryTech sx={{ fontSize: 32 }} />,
        title: 'Hạng thành viên ưu đãi',
        desc: 'Tích điểm, lên hạng nhận ưu đãi',
        color: 'primary.main',
        link: '/policy/rank',
    },
    {
        icon: <Icon.VerifiedUser sx={{ fontSize: 32 }} />,
        title: 'Cam kết bảo hành',
        desc: 'Hàng chính hãng, bảo hành đầy đủ',
        color: 'success.main',
        link: '/policy/warranty',
    },
    {
        icon: <Icon.ChatBubbleOutline sx={{ fontSize: 32 }} />,
        title: 'Tư vấn trực tiếp',
        desc: 'Liên hệ Zalo/Hotline, phản hồi nhanh',
        color: 'info.main',
        // tạm thời trỏ ra kênh liên hệ ngoài, chưa có chat box nội bộ
        link: 'https://zalo.me/YOUR_ZALO_ID',
        external: true,
    },
    {
        icon: <Icon.Replay sx={{ fontSize: 32 }} />,
        title: 'Đổi hàng dễ dàng',
        desc: 'Trong vòng 7 ngày kể từ khi nhận hàng',
        color: 'warning.main',
        link: '/policy/exchange',
    },
]

const FeatureItem = ({ f }) => {
    const commonProps = {
        variant: 'outlined',
        sx: {
            p: 2.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            height: '100%',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: f.color },
        },
    }

    const content = (
        <>
            <Mui.Box sx={{ color: f.color, flexShrink: 0 }}>{f.icon}</Mui.Box>
            <Mui.Box>
                <Mui.Typography variant="body2" fontWeight={800}>{f.title}</Mui.Typography>
                <Mui.Typography variant="caption" color="text.secondary">{f.desc}</Mui.Typography>
            </Mui.Box>
        </>
    )

    if (f.external) {
        return (
            <Mui.Paper {...commonProps} component="a" href={f.link} target="_blank" rel="noopener noreferrer">
                {content}
            </Mui.Paper>
        )
    }

    return (
        <Mui.Paper {...commonProps} component={Link} to={f.link}>
            {content}
        </Mui.Paper>
    )
}

const FeatureBanner = () => (
    <Mui.Grid container spacing={2} sx={{ py: 2 }}>
        {FEATURES.map((f, i) => (
            <Mui.Grid item xs={6} md={3} key={i}>
                <FeatureItem f={f} />
            </Mui.Grid>
        ))}
    </Mui.Grid>
)

export default FeatureBanner