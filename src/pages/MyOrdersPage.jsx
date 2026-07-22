import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import useDonHang from '@/hook/donhang/useDonHang'
import { TRANG_THAI_LABEL, TRANG_THAI_DON_HANG, LY_DO_HUY_LABEL } from '@/constants/donhangContants'
import { UI_SETTING } from '@/theme/uiSetting'
import { useState } from 'react'

// ── Sub-components ────────────────────────────────────────────────────────────

const FilterTabs = ({ value, onChange }) => (
    <Mui.Tabs
        value={value}
        onChange={(_, v) => onChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
    >
        <Mui.Tab label="Tất cả" value="" />
        {Object.entries(TRANG_THAI_LABEL).map(([key, { label }]) => (
            <Mui.Tab key={key} label={label} value={Number(key)} />
        ))}
    </Mui.Tabs>
)

const OrderCard = ({ order, onViewDetail, onCancel, canCancel }) => (
    <Mui.Card variant="outlined" sx={{ mb: 2, borderRadius: UI_SETTING.SHAPE.CARD_RADIUS }}>
        <Mui.CardContent>
            <Mui.Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Mui.Typography variant="subtitle2" color="text.secondary">
                    Đơn hàng #{order.shortId}
                </Mui.Typography>
                <Mui.Chip label={order.trangThaiLabel} color={order.trangThaiColor} size="small" />
            </Mui.Stack>

            <Mui.Divider sx={{ my: 1 }} />

            {order.chiTiet.map(item => (
                <Mui.Stack key={item.id} direction="row" alignItems="center" spacing={1.5} py={0.75}>
                    {/* Ảnh sản phẩm */}
                    <Mui.Avatar
                        src={item.anhDaiDien}
                        variant="rounded"
                        sx={{ width: 48, height: 48, bgcolor: 'grey.100' }}
                    >
                        <Icon.Inventory2 />
                    </Mui.Avatar>

                    {/* Tên + số lượng — có thể click xem SP */}
                    <Mui.Box flex={1}>
                        <Mui.Link
                            component={RouterLink}
                            to={`/products/${item.sanpham_id}`}
                            underline="hover"
                            color="text.primary"
                            variant="body2"
                            fontWeight={500}
                        >
                            {item.ten}
                        </Mui.Link>
                        <Mui.Typography variant="caption" color="text.secondary" display="block">
                            × {item.soluong} · {item.dongiaFormatted}
                        </Mui.Typography>
                    </Mui.Box>

                    <Mui.Typography variant="body2" fontWeight={600}>
                        {item.tongTienFormatted}
                    </Mui.Typography>
                </Mui.Stack>
            ))}

            <Mui.Divider sx={{ my: 1 }} />

            <Mui.Stack spacing={0.5} mb={1}>
                <Mui.Stack direction="row" justifyContent="space-between">
                    <Mui.Typography variant="caption" color="text.secondary">Tạm tính</Mui.Typography>
                    <Mui.Typography variant="caption">{order.tienHangFormatted}</Mui.Typography>
                </Mui.Stack>
                <Mui.Stack direction="row" justifyContent="space-between">
                    <Mui.Typography variant="caption" color="text.secondary">Phí vận chuyển</Mui.Typography>
                    <Mui.Typography variant="caption">- {order.phiVanChuyenFormatted}</Mui.Typography>
                </Mui.Stack>
                <Mui.Stack direction="row" justifyContent="space-between">
                    <Mui.Typography variant="caption" color="text.secondary">Giảm giá</Mui.Typography>
                    <Mui.Typography variant="caption">- {order.giamGiaFormatted}</Mui.Typography>
                </Mui.Stack>
            </Mui.Stack>

            <Mui.Stack direction="row" justifyContent="space-between" alignItems="center">
                <Mui.Typography variant="body2" color="text.secondary">
                    Tổng tiền:
                </Mui.Typography>
                <Mui.Typography variant="subtitle1" fontWeight={700} color="primary.main">
                    {order.tongTienFormatted}
                </Mui.Typography>
            </Mui.Stack>

            <Mui.Stack direction="row" justifyContent="space-between" alignItems="center">
                <Mui.Typography variant="body2" color="text.secondary">
                    {order.createdAtFormatted}
                </Mui.Typography>
            </Mui.Stack>
        </Mui.CardContent>

        <Mui.CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
            <Mui.Button size="small" variant="outlined" startIcon={<Icon.Visibility />} onClick={() => onViewDetail(order)}>
                Chi tiết
            </Mui.Button>
            {canCancel(order.trangthai) && (
                <Mui.Button size="small" variant="outlined" color="error" startIcon={<Icon.Cancel />} onClick={() => onCancel(order.donhang_id)}>
                    Hủy đơn
                </Mui.Button>
            )}
        </Mui.CardActions>
    </Mui.Card>
)

const OrderDetailModal = ({ order, open, onClose }) => (
    <Mui.Modal open={open} onClose={onClose} closeAfterTransition>
        <Mui.Box sx={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 520 },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: UI_SETTING.MODAL.PADDING,
            borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
            outline: 'none',
            borderTop: '5px solid',
            borderColor: 'primary.main',
            maxHeight: '80vh',
            overflowY: 'auto',
        }}>
            {order && <>
                <Mui.Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Mui.Typography variant="h6" fontWeight={700}>
                        Chi tiết đơn #{order.shortId}
                    </Mui.Typography>
                    <Mui.IconButton onClick={onClose}><Icon.Close /></Mui.IconButton>
                </Mui.Stack>

                <Mui.Stack spacing={1} mb={2}>
                    <Mui.Typography variant='boyd2'

                    />
                    <Mui.Typography variant="body2">
                        <b>Địa chỉ:</b> {order.diachi}
                    </Mui.Typography>
                    <Mui.Typography variant="body2">
                        <b>SĐT:</b> {order.sdt}
                    </Mui.Typography>
                    <Mui.Typography variant="body2" component="div">
                        <b>Trạng thái:</b>{' '}
                        <Mui.Chip label={order.trangThaiLabel} color={order.trangThaiColor} size="small" />
                    </Mui.Typography>
                    <Mui.Typography variant="body2">
                        <b>Ngày đặt:</b> {order.createdAtFormatted}
                    </Mui.Typography>
                </Mui.Stack>

                <Mui.Divider sx={{ mb: 2 }} />

                <Mui.Typography variant="subtitle2" mb={1}>Sản phẩm</Mui.Typography>
                {order.chiTiet.map(item => (
                    <Mui.Stack key={item.id} direction="row" alignItems="center" spacing={1.5} py={0.75}>
                        <Mui.Avatar
                            src={item.anhDaiDien}
                            variant="rounded"
                            sx={{ width: 56, height: 56, bgcolor: 'grey.100' }}
                        >
                            <Icon.Inventory2 />
                        </Mui.Avatar>

                        <Mui.Box flex={1}>
                            <Mui.Link
                                component={RouterLink}
                                to={`/products/${item.sanpham_id}`}
                                underline="hover"
                                color="text.primary"
                                variant="body2"
                                fontWeight={500}
                            >
                                {item.ten}
                            </Mui.Link>
                            <Mui.Typography variant="caption" color="text.secondary" display="block">
                                × {item.soluong} · {item.dongiaFormatted}
                            </Mui.Typography>
                        </Mui.Box>

                        <Mui.Typography variant="body2" fontWeight={600}>
                            {item.tongTienFormatted}
                        </Mui.Typography>
                    </Mui.Stack>
                ))}

                <Mui.Divider sx={{ my: 2 }} />

                <Mui.Stack spacing={1} mb={1}>
                    <Mui.Stack direction="row" justifyContent="space-between">
                        <Mui.Typography variant="body2" color="text.secondary">Tạm tính</Mui.Typography>
                        <Mui.Typography variant="body2">{order.tienHangFormatted}</Mui.Typography>
                    </Mui.Stack>
                    <Mui.Stack direction="row" justifyContent="space-between">
                        <Mui.Typography variant="body2" color="text.secondary">Phí vận chuyển</Mui.Typography>
                        <Mui.Typography variant="body2">- {order.phiVanChuyenFormatted}</Mui.Typography>
                    </Mui.Stack>
                    <Mui.Stack direction="row" justifyContent="space-between">
                        <Mui.Typography variant="body2" color="text.secondary">Giảm giá</Mui.Typography>
                        <Mui.Typography variant="body2">- {order.giamGiaFormatted}</Mui.Typography>
                    </Mui.Stack>
                </Mui.Stack>

                <Mui.Divider sx={{ mb: 1.5 }} />

                <Mui.Stack direction="row" justifyContent="space-between">
                    <Mui.Typography variant="subtitle1" fontWeight={700}>Tổng tiền</Mui.Typography>
                    <Mui.Typography variant="subtitle1" fontWeight={700} color="primary.main">
                        {order.tongTienFormatted}
                    </Mui.Typography>
                </Mui.Stack>
            </>}
        </Mui.Box>
    </Mui.Modal>
)

const ConfirmCancelDialog = ({ open, onClose, onConfirm, loading }) => {
    const [lyDoHuy, setLyDoHuy] = useState('')
    const [ghiChuHuy, setGhiChuHuy] = useState('')

    const laLyDoKhac = Number(lyDoHuy) === 5 // KHAC = 5, theo LyDoHuyDonHang backend

    const handleClose = () => {
        setLyDoHuy('')
        setGhiChuHuy('')
        onClose()
    }

    const handleConfirm = () => {
        onConfirm({ ly_do_huy: lyDoHuy === '' ? undefined : Number(lyDoHuy), ghi_chu_huy: ghiChuHuy || undefined })
    }

    return (
        <Mui.Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <Mui.DialogTitle>Xác nhận hủy đơn</Mui.DialogTitle>
            <Mui.DialogContent>
                <Mui.Typography sx={{ mb: 2 }}>
                    Bạn có chắc muốn hủy đơn hàng này không?
                </Mui.Typography>

                <Mui.FormControl fullWidth size="small" sx={{ mb: laLyDoKhac ? 2 : 0 }}>
                    <Mui.InputLabel id="ly-do-huy-label">Lý do hủy (không bắt buộc)</Mui.InputLabel>
                    <Mui.Select
                        labelId="ly-do-huy-label"
                        label="Lý do hủy (không bắt buộc)"
                        value={lyDoHuy}
                        onChange={(e) => setLyDoHuy(e.target.value)}
                    >
                        <Mui.MenuItem value="">-- Không chọn --</Mui.MenuItem>
                        {Object.entries(LY_DO_HUY_LABEL).map(([val, label]) => (
                            <Mui.MenuItem key={val} value={val}>{label}</Mui.MenuItem>
                        ))}
                    </Mui.Select>
                </Mui.FormControl>

                {laLyDoKhac && (
                    <Mui.TextField
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        label="Nhập lý do cụ thể"
                        value={ghiChuHuy}
                        onChange={(e) => setGhiChuHuy(e.target.value)}
                    />
                )}
            </Mui.DialogContent>
            <Mui.DialogActions>
                <Mui.Button onClick={handleClose} disabled={loading}>Không</Mui.Button>
                <Mui.Button onClick={handleConfirm} color="error" variant="contained" disabled={loading}>
                    {loading ? <Mui.CircularProgress size={20} /> : 'Hủy đơn'}
                </Mui.Button>
            </Mui.DialogActions>
        </Mui.Dialog>
    )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const MyOrdersPage = () => {
    const {
        orders, loading, cancelling,
        page, setPage, totalPages, total,
        filterTrangthai, setFilterTrangthai,
        selectedOrder, openDetail, viewDetail, closeDetail,
        confirmCancel, openCancelConfirm, closeCancelConfirm, cancelOrder,
        canCancel, snackbar, closeSnackbar,
    } = useDonHang()

    return (
        <Mui.Container maxWidth="md" sx={{ py: 4 }}>
            <Mui.Typography variant="h5" fontWeight={700} mb={3}>
                Lịch sử đơn hàng
            </Mui.Typography>

            <FilterTabs value={filterTrangthai} onChange={(v) => { setFilterTrangthai(v); setPage(1) }} />

            {loading ? (
                [...Array(3)].map((_, i) => (
                    <Mui.Skeleton key={i} variant="rectangular" height={160} sx={{ mb: 2, borderRadius: 2 }} />
                ))
            ) : orders.length === 0 ? (
                <Mui.Box textAlign="center" py={8}>
                    <Icon.Inbox sx={{ fontSize: 64, color: 'text.disabled' }} />
                    <Mui.Typography color="text.secondary" mt={1}>Chưa có đơn hàng nào</Mui.Typography>
                </Mui.Box>
            ) : (
                orders.map(order => (
                    <OrderCard
                        key={order.donhang_id}
                        order={order}
                        onViewDetail={viewDetail}
                        onCancel={openCancelConfirm}
                        canCancel={canCancel}
                    />
                ))
            )}

            {totalPages > 1 && (
                <Mui.Stack alignItems="center" mt={3}>
                    <Mui.Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, v) => setPage(v)}
                        color="primary"
                    />
                </Mui.Stack>
            )}

            <OrderDetailModal order={selectedOrder} open={openDetail} onClose={closeDetail} />

            <ConfirmCancelDialog
                open={confirmCancel.open}
                onClose={closeCancelConfirm}
                onConfirm={cancelOrder}
                loading={cancelling}
            />

            <Mui.Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Mui.Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Mui.Alert>
            </Mui.Snackbar>
        </Mui.Container>
    )
}

export default MyOrdersPage