// pages/policy/WarrantyPolicyPage.jsx
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'

const WarrantyPolicyPage = () => (
    <Mui.Container maxWidth="md" sx={{ py: 6 }}>
        <Mui.Typography variant="h4" fontWeight={900} gutterBottom>
            Chính sách bảo hành
        </Mui.Typography>

        <Mui.Stack spacing={3} sx={{ mt: 3 }}>
            <Mui.Box sx={{ display: 'flex', gap: 2 }}>
                <Icon.VerifiedUser color="primary" />
                <Mui.Box>
                    <Mui.Typography fontWeight={700}>Cam kết hàng chính hãng</Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary">
                        Toàn bộ sản phẩm được bán tại cửa hàng đều là hàng chính hãng, có nguồn gốc rõ ràng, đầy đủ tem/phiếu bảo hành từ nhà sản xuất hoặc nhà phân phối uỷ quyền.
                    </Mui.Typography>
                </Mui.Box>
            </Mui.Box>

            <Mui.Box sx={{ display: 'flex', gap: 2 }}>
                <Icon.Build color="primary" />
                <Mui.Box>
                    <Mui.Typography fontWeight={700}>Phạm vi bảo hành</Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary">
                        Sản phẩm được bảo hành theo đúng thời hạn và điều kiện của nhà sản xuất. Thời gian bảo hành cụ thể được ghi rõ trên phiếu bảo hành hoặc trang chi tiết sản phẩm tại thời điểm mua hàng.
                    </Mui.Typography>
                </Mui.Box>
            </Mui.Box>

            <Mui.Box sx={{ display: 'flex', gap: 2 }}>
                <Icon.Block color="primary" />
                <Mui.Box>
                    <Mui.Typography fontWeight={700}>Trường hợp không được bảo hành</Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary">
                        Sản phẩm hư hỏng do rơi vỡ, ngấm nước, tự ý tháo lắp/sửa chữa ở nơi không được uỷ quyền, hoặc sử dụng sai hướng dẫn của nhà sản xuất sẽ không thuộc phạm vi bảo hành miễn phí.
                    </Mui.Typography>
                </Mui.Box>
            </Mui.Box>

            <Mui.Box sx={{ display: 'flex', gap: 2 }}>
                <Icon.SupportAgent color="primary" />
                <Mui.Box>
                    <Mui.Typography fontWeight={700}>Cách thức bảo hành</Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary">
                        Liên hệ trực tiếp qua khung chat hỗ trợ hoặc mang sản phẩm kèm phiếu bảo hành đến cửa hàng để được kiểm tra và hỗ trợ nhanh nhất.
                    </Mui.Typography>
                </Mui.Box>
            </Mui.Box>
        </Mui.Stack>
    </Mui.Container>
)

export default WarrantyPolicyPage