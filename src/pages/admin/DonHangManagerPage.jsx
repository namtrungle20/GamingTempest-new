// pages/admin/DonHangPage.jsx
import { useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import useDonHangManager from '@/hook/admin/useDonHangManager'
import { donHangService } from '@/services/donhang.service'
import { TRANG_THAI_LABEL, TRANG_THAI_DON_HANG, NEXT_TRANG_THAI, KHONG_THE_HUY } from '@/constants/donhangContants'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import DonHang from '@/models/DonHang'

const DonHangPage = () => {
    const {
        orders, loading, updating,
        page, setPage,
        search, setSearch,
        totalPages, total,
        filterTrangthai, setFilterTrangthai, createdAt, setCreatedAt,
        updateTrangthai, cancelOrder,
    } = useDonHangManager()


    const [selected, setSelected] = useState(null)       // DonHangModel với chiTiet
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [confirmCancel, setConfirmCancel] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const showSnack = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity })

    const canCancel = (trangthai) => !KHONG_THE_HUY.includes(trangthai)

    const handleViewDetail = async (order) => {
        setLoadingDetail(true)
        setSelected(order) // mở drawer trước với data cơ bản
        const res = await donHangService.getById(order.donhang_id)
        if (res.success) {
            setSelected(new DonHang(res.raw.data))
        }
        setLoadingDetail(false)
    }

    const handleUpdateTrangthai = async (donhang_id, trangthai) => {
        const res = await updateTrangthai(donhang_id, trangthai)
        if (res.success) {
            showSnack('Cập nhật trạng thái thành công')
            if (selected?.donhang_id === donhang_id)
                setSelected(prev => new DonHang({ ...prev, trangthai }))
        } else {
            showSnack(res.message, 'error')
        }
    }

    const handleCancel = async () => {
        const res = await cancelOrder(confirmCancel)
        if (res.success) showSnack('Đơn hàng đã được hủy')
        else showSnack(res.message, 'error')
        setConfirmCancel(null)
        if (selected?.donhang_id === confirmCancel) setSelected(null)
    }

    return (
        <Mui.Box sx={{ p: 3 }}>
            {/* Header */}
            <Mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Mui.Box>
                    <Mui.Typography variant="h5" fontWeight={700}>Quản lý đơn hàng</Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary">Tổng: {total} đơn hàng</Mui.Typography>
                </Mui.Box>
                <Mui.Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {/* Thêm ô tìm kiếm nếu bạn muốn dùng state `search` đã sửa ở hook */}
                    <Mui.TextField
                        size="small"
                        label="Tìm theo người dùng"
                        placeholder="Tên, email hoặc SĐT..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        sx={{ minWidth: 220 }}
                    />

                    <Mui.FormControl size="small" sx={{ minWidth: 180 }}>
                        <Mui.InputLabel id="select-trang-thai-label">Trạng thái</Mui.InputLabel>
                        <Mui.Select
                            labelId="select-trang-thai-label"
                            value={filterTrangthai}
                            label="Trạng thái"
                            onChange={(e) => { setFilterTrangthai(e.target.value); setPage(1) }}
                        >
                            <Mui.MenuItem value="">Tất cả</Mui.MenuItem>
                            {Object.entries(TRANG_THAI_LABEL).map(([val, { label }]) => (
                                <Mui.MenuItem key={val} value={Number(val)}>{label}</Mui.MenuItem>
                            ))}
                        </Mui.Select>
                    </Mui.FormControl>

                    {/* Ô Chọn ngày tạo */}
                    <DatePicker
                        label="Ngày tạo"
                        format="DD/MM/YYYY"
                        value={createdAt ? dayjs(createdAt) : null}
                        onChange={(newValue) => {
                            setCreatedAt(newValue ? newValue.format('YYYY-MM-DD') : '')
                            setPage(1)
                        }}
                        slotProps={{
                            textField: { size: 'small', sx: { minWidth: 180 } }
                        }}
                    />
                </Mui.Box>
            </Mui.Box>

            {/* Table */}
            <Mui.Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Mui.TableContainer>
                    <Mui.Table>
                        <Mui.TableHead>
                            <Mui.TableRow sx={{ bgcolor: 'action.hover' }}>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Mã đơn</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Địa chỉ</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>SĐT</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }} align="right">Tổng tiền</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }} align="center">Trạng thái</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Ngày tạo</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }} align="center">Thao tác</Mui.TableCell>
                            </Mui.TableRow>
                        </Mui.TableHead>
                        <Mui.TableBody>
                            {loading ? (
                                <Mui.TableRow>
                                    <Mui.TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <Mui.CircularProgress size={32} />
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            ) : orders.length === 0 ? (
                                <Mui.TableRow>
                                    <Mui.TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                        Không có đơn hàng nào
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            ) : orders.map(order => (
                                <Mui.TableRow key={order.donhang_id} hover>
                                    <Mui.TableCell>
                                        <Mui.Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                            {order.shortId}
                                        </Mui.Typography>
                                    </Mui.TableCell>
                                    <Mui.TableCell>
                                        <Mui.Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                                            {order.diachi}
                                        </Mui.Typography>
                                    </Mui.TableCell>
                                    <Mui.TableCell>{order.sdt}</Mui.TableCell>
                                    <Mui.TableCell align="right">
                                        <Mui.Typography variant="body2" fontWeight={600} color="primary.main">
                                            {order.tongTienFormatted}
                                        </Mui.Typography>
                                    </Mui.TableCell>
                                    <Mui.TableCell align="center">
                                        <Mui.Chip size="small" label={order.trangThaiLabel} color={order.trangThaiColor} />
                                    </Mui.TableCell>
                                    <Mui.TableCell>
                                        <Mui.Typography variant="caption" color="text.secondary">
                                            {order.createdAtFormatted}
                                        </Mui.Typography>
                                    </Mui.TableCell>
                                    <Mui.TableCell align="center">
                                        <Mui.Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                            <Mui.Tooltip title="Xem chi tiết">
                                                <Mui.IconButton size="small" onClick={() => handleViewDetail(order)}>
                                                    <Icon.Visibility fontSize="small" />
                                                </Mui.IconButton>
                                            </Mui.Tooltip>
                                            {canCancel(order.trangthai) && (
                                                <Mui.Tooltip title="Hủy đơn">
                                                    <Mui.IconButton size="small" color="error"
                                                        onClick={() => setConfirmCancel(order.donhang_id)}>
                                                        <Icon.Cancel fontSize="small" />
                                                    </Mui.IconButton>
                                                </Mui.Tooltip>
                                            )}
                                        </Mui.Box>
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            ))}
                        </Mui.TableBody>
                    </Mui.Table>
                </Mui.TableContainer>
                {totalPages > 1 && (
                    <Mui.Box sx={{ display: 'flex', justifyContent: 'center', p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                        <Mui.Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
                    </Mui.Box>
                )}
            </Mui.Paper>

            {/* Detail Drawer */}
            <Mui.Drawer
                anchor="right"
                open={!!selected}
                onClose={() => setSelected(null)}
                PaperProps={{ sx: { width: { xs: '100%', sm: 520 }, display: 'flex', flexDirection: 'column' } }}
            >
                {selected && (
                    <>
                        {/* Drawer Header */}
                        <Mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Mui.Typography variant="h6" fontWeight={700}>Chi tiết đơn hàng</Mui.Typography>
                            <Mui.IconButton onClick={() => setSelected(null)}><Icon.Close /></Mui.IconButton>
                        </Mui.Box>

                        <Mui.Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
                            {loadingDetail ? (
                                <Mui.Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                                    <Mui.CircularProgress />
                                </Mui.Box>
                            ) : (
                                <>
                                    {/* Thông tin đơn hàng */}
                                    <Mui.Typography variant="overline" color="text.secondary" fontWeight={700}>
                                        Thông tin đơn hàng
                                    </Mui.Typography>
                                    <Mui.Paper variant="outlined" sx={{ p: 2, mt: 1, mb: 2.5, borderRadius: 2 }}>
                                        {[
                                            { label: 'Mã đơn', value: selected.donhang_id },
                                            { label: 'Địa chỉ', value: selected.diachi },
                                            { label: 'Số điện thoại', value: selected.sdt },
                                            { label: 'Ngày tạo', value: selected.createdAtFormatted },
                                            { label: 'Cập nhật', value: selected.updatedAtFormatted },
                                        ].map(({ label, value }) => (
                                            <Mui.Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Mui.Typography variant="body2" color="text.secondary">{label}</Mui.Typography>
                                                <Mui.Typography variant="body2" fontWeight={600} sx={{ maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>
                                                    {value}
                                                </Mui.Typography>
                                            </Mui.Box>
                                        ))}
                                        <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Mui.Typography variant="body2" color="text.secondary">Trạng thái</Mui.Typography>
                                            <Mui.Chip size="small" label={selected.trangThaiLabel} color={selected.trangThaiColor} />
                                        </Mui.Box>
                                    </Mui.Paper>

                                    {/* Thông tin khách hàng */}
                                    {selected.nguoiDung && (
                                        <>
                                            <Mui.Typography variant="overline" color="text.secondary" fontWeight={700}>
                                                Khách hàng
                                            </Mui.Typography>
                                            <Mui.Paper variant="outlined" sx={{ p: 2, mt: 1, mb: 2.5, borderRadius: 2 }}>
                                                {[
                                                    // { label: 'Họ tên', value: selected.nguoiDung.ho_ten || '—' },
                                                    { label: 'Email', value: selected.nguoiDung.email },
                                                    { label: 'SĐT', value: selected.nguoiDung.sdt || '—' },
                                                ].map(({ label, value }) => (
                                                    <Mui.Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Mui.Typography variant="body2" color="text.secondary">{label}</Mui.Typography>
                                                        <Mui.Typography variant="body2" fontWeight={600}>{value}</Mui.Typography>
                                                    </Mui.Box>
                                                ))}
                                            </Mui.Paper>
                                        </>
                                    )}

                                    {/* Sản phẩm trong đơn */}
                                    <Mui.Typography variant="overline" color="text.secondary" fontWeight={700}>
                                        Sản phẩm ({selected.chiTiet.length})
                                    </Mui.Typography>
                                    <Mui.Paper variant="outlined" sx={{ mt: 1, mb: 2.5, borderRadius: 2, overflow: 'hidden' }}>
                                        {selected.chiTiet.length === 0 ? (
                                            <Mui.Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                                                Không có sản phẩm
                                            </Mui.Typography>
                                        ) : selected.chiTiet.map((item, idx) => (
                                            <Mui.Box key={item.id} sx={{
                                                display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                                                borderBottom: idx < selected.chiTiet.length - 1 ? '1px solid' : 'none',
                                                borderColor: 'divider'
                                            }}>
                                                <Mui.Box sx={{ flex: 1 }}>
                                                    <Mui.Typography variant="body2" fontWeight={600}>{item.ten}</Mui.Typography>
                                                    <Mui.Typography variant="caption" color="text.secondary">
                                                        {item.dongiaFormatted} × {item.soluong}
                                                    </Mui.Typography>
                                                </Mui.Box>
                                                <Mui.Typography variant="body2" fontWeight={700} color="primary.main">
                                                    {item.tongTienFormatted}
                                                </Mui.Typography>
                                            </Mui.Box>
                                        ))}
                                        {/* Tổng tiền */}
                                        <Mui.Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: 'action.hover' }}>
                                            <Mui.Typography variant="subtitle2" fontWeight={700}>Tổng cộng</Mui.Typography>
                                            <Mui.Typography variant="subtitle2" fontWeight={700} color="primary.main">
                                                {selected.tongTienFormatted}
                                            </Mui.Typography>
                                        </Mui.Box>
                                    </Mui.Paper>

                                    {/* Chuyển trạng thái */}
                                    {NEXT_TRANG_THAI[selected.trangthai]?.length > 0 && (
                                        <>
                                            <Mui.Typography variant="overline" color="text.secondary" fontWeight={700}>
                                                Chuyển trạng thái
                                            </Mui.Typography>
                                            <Mui.Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                                                {NEXT_TRANG_THAI[selected.trangthai].map(tt => (
                                                    <Mui.Button
                                                        key={tt}
                                                        size="small"
                                                        variant="outlined"
                                                        color={TRANG_THAI_LABEL[tt]?.color || 'primary'}
                                                        disabled={updating}
                                                        onClick={() => handleUpdateTrangthai(selected.donhang_id, tt)}
                                                    >
                                                        {TRANG_THAI_LABEL[tt]?.label}
                                                    </Mui.Button>
                                                ))}
                                            </Mui.Box>
                                        </>
                                    )}
                                </>
                            )}
                        </Mui.Box>

                        {/* Drawer Footer — nút hủy đơn */}
                        {canCancel(selected.trangthai) && (
                            <Mui.Box sx={{ p: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                                <Mui.Button
                                    fullWidth variant="outlined" color="error"
                                    startIcon={<Icon.Cancel />}
                                    onClick={() => setConfirmCancel(selected.donhang_id)}
                                >
                                    Hủy đơn hàng
                                </Mui.Button>
                            </Mui.Box>
                        )}
                    </>
                )}
            </Mui.Drawer>

            {/* Confirm Cancel Dialog */}
            <Mui.Dialog open={!!confirmCancel} onClose={() => setConfirmCancel(null)}>
                <Mui.DialogTitle>Xác nhận hủy đơn</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.Typography>
                        Đơn hàng sẽ chuyển sang trạng thái <strong>Đã hủy</strong> và vẫn được lưu lại để thống kê.
                    </Mui.Typography>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Mui.Button onClick={() => setConfirmCancel(null)}>Đóng</Mui.Button>
                    <Mui.Button color="error" variant="contained" onClick={handleCancel}>Xác nhận hủy</Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>

            {/* Snackbar */}
            <Mui.Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Mui.Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
                    {snackbar.message}
                </Mui.Alert>
            </Mui.Snackbar>
        </Mui.Box >
    )
}

export default DonHangPage
