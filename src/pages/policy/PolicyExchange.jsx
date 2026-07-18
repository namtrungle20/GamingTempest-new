// pages/policy/ExchangePolicyPage.jsx
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'

const STEPS = [
    { title: 'Liên hệ trong 7 ngày', desc: 'Kể từ ngày nhận hàng, liên hệ qua khung chat hỗ trợ hoặc hotline để yêu cầu đổi hàng.' },
    { title: 'Kiểm tra điều kiện', desc: 'Sản phẩm còn nguyên tem, nhãn mác, chưa qua sử dụng và còn đầy đủ hộp/phụ kiện đi kèm.' },
    { title: 'Gửi trả sản phẩm', desc: 'Đóng gói sản phẩm và gửi về địa chỉ cửa hàng theo hướng dẫn từ nhân viên hỗ trợ.' },
    { title: 'Nhận sản phẩm mới', desc: 'Sau khi kiểm tra đạt yêu cầu, sản phẩm thay thế sẽ được gửi lại trong thời gian sớm nhất.' },
]

const ExchangePolicyPage = () => (
    <Mui.Container maxWidth="md" sx={{ py: 6 }}>
        <Mui.Typography variant="h4" fontWeight={900} gutterBottom>
            Chính sách đổi hàng
        </Mui.Typography>
        <Mui.Typography color="text.secondary" sx={{ mb: 4 }}>
            Hỗ trợ đổi hàng trong vòng <strong>7 ngày</strong> kể từ khi nhận hàng đối với sản phẩm lỗi do nhà sản xuất hoặc không đúng mô tả.
        </Mui.Typography>

        <Mui.Stack spacing={2}>
            {STEPS.map((s, i) => (
                <Mui.Box key={i} sx={{ display: 'flex', gap: 2 }}>
                    <Mui.Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14 }}>{i + 1}</Mui.Avatar>
                    <Mui.Box>
                        <Mui.Typography fontWeight={700}>{s.title}</Mui.Typography>
                        <Mui.Typography variant="body2" color="text.secondary">{s.desc}</Mui.Typography>
                    </Mui.Box>
                </Mui.Box>
            ))}
        </Mui.Stack>
    </Mui.Container>
)

export default ExchangePolicyPage