import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import useUuDaiManager from '@/hook/admin/useUuDaiManager'
import { getHangConfig, formatTienNgan } from '@/constants/rankConstants'

const UuDaiManagerPage = () => {
    const {
        danhSach,
        loading,
        savingHang,
        handleChangePhanTram,
        handleToggleTrangThai,
        handleSavePhanTram,
    } = useUuDaiManager()

    if (loading) {
        return (
            <Mui.Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
                <Mui.CircularProgress />
            </Mui.Box>
        )
    }

    return (
        <Mui.Container maxWidth="md" sx={{ py: 4 }}>
            <Mui.Typography variant="h5" fontWeight={800} mb={0.5}>
                Ưu đãi theo hạng thành viên
            </Mui.Typography>
            <Mui.Typography variant="body2" color="text.secondary" mb={3}>
                Thiết lập % giảm giá tự động áp dụng khi khách hàng thanh toán, dựa theo hạng thành viên hiện tại.
            </Mui.Typography>

            <Mui.Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Mui.Table>
                    <Mui.TableHead>
                        <Mui.TableRow sx={{ bgcolor: 'action.hover' }}>
                            <Mui.TableCell sx={{ fontWeight: 700 }}>Hạng</Mui.TableCell>
                            <Mui.TableCell sx={{ fontWeight: 700 }}>Điều kiện</Mui.TableCell>
                            <Mui.TableCell sx={{ fontWeight: 700 }} width={220}>% Giảm giá</Mui.TableCell>
                            <Mui.TableCell sx={{ fontWeight: 700 }} align="center" width={100}>Áp dụng</Mui.TableCell>
                            <Mui.TableCell sx={{ fontWeight: 700 }} align="right" width={100}>Lưu</Mui.TableCell>
                        </Mui.TableRow>
                    </Mui.TableHead>
                    <Mui.TableBody>
                        {danhSach.map((item) => {
                            const config = getHangConfig(item.hang)
                            const HangIcon = Icon[config.icon] || Icon.MilitaryTech
                            const dangLuu = savingHang === item.hang

                            return (
                                <Mui.TableRow key={item.hang} hover>
                                    <Mui.TableCell>
                                        <Mui.Stack direction="row" alignItems="center" gap={1.2}>
                                            <Mui.Box sx={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                bgcolor: config.bgColor, color: config.color, flexShrink: 0
                                            }}>
                                                <HangIcon sx={{ fontSize: 18 }} />
                                            </Mui.Box>
                                            <Mui.Typography fontWeight={700}>{config.label}</Mui.Typography>
                                        </Mui.Stack>
                                    </Mui.TableCell>

                                    <Mui.TableCell>
                                        <Mui.Typography variant="body2" color="text.secondary">
                                            {config.dieuKien > 0
                                                ? `Chi tiêu từ ${formatTienNgan(config.dieuKien)}`
                                                : 'Mặc định'}
                                        </Mui.Typography>
                                    </Mui.TableCell>

                                    <Mui.TableCell>
                                        <Mui.TextField
                                            size="small"
                                            type="number"
                                            value={item.phan_tram_giam}
                                            onChange={(e) => handleChangePhanTram(item.hang, e.target.value)}
                                            disabled={!item.trang_thai}
                                            InputProps={{
                                                endAdornment: <Mui.InputAdornment position="end">%</Mui.InputAdornment>,
                                                inputProps: { min: 0, max: 100, step: 0.5 }
                                            }}
                                            sx={{ width: 140 }}
                                        />
                                    </Mui.TableCell>

                                    <Mui.TableCell align="center">
                                        <Mui.Switch
                                            checked={item.trang_thai}
                                            onChange={(e) => handleToggleTrangThai(item.hang, e.target.checked)}
                                        />
                                    </Mui.TableCell>

                                    <Mui.TableCell align="right">
                                        <Mui.IconButton
                                            color="primary"
                                            disabled={!item.trang_thai || dangLuu}
                                            onClick={() => handleSavePhanTram(item.hang)}
                                        >
                                            {dangLuu
                                                ? <Mui.CircularProgress size={20} />
                                                : <Icon.SaveOutlined fontSize="small" />}
                                        </Mui.IconButton>
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            )
                        })}
                    </Mui.TableBody>
                </Mui.Table>
            </Mui.Paper>

            <Mui.Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                Ưu đãi được áp dụng tự động trên tổng tiền sản phẩm (chưa gồm phí ship) ngay khi khách hàng thanh toán. Tắt công tắc để tạm ngưng ưu đãi cho hạng đó mà không cần xóa cấu hình.
            </Mui.Alert>
        </Mui.Container>
    )
}

export default UuDaiManagerPage