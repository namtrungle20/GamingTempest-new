import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import useChiTietSanPhamManager from '@/hook/admin/useChiTietSanPhamManager'
import { useState } from 'react'

const ChiTietSanPhamPanel = ({ sanpham_id }) => {
    const {
        chiTiets, loading, form, editTarget,
        handleFormChange, openEdit, closeEdit,
        handleSubmit, handleDelete,
    } = useChiTietSanPhamManager(sanpham_id)

    const [confirmDelete, setConfirmDelete] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const notify = (message, severity = 'success') =>
        setSnackbar({ open: true, message, severity })

    const onSubmit = async () => {
        if (!form.name || !form.gia_tri) return
        setSubmitting(true)
        const result = await handleSubmit()
        if (result?.success) notify(editTarget ? 'Cập nhật thành công' : 'Thêm thành công')
        else notify(result?.message || 'Có lỗi xảy ra', 'error')
        setSubmitting(false)
    }

    const onDelete = async (id) => {
        const result = await handleDelete(id)
        if (result?.success) notify('Xóa thành công')
        else notify(result?.message || 'Có lỗi xảy ra', 'error')
        setConfirmDelete(null)
    }

    return (
        <Mui.Box>
            {/* Form thêm/sửa */}
            <Mui.Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Mui.Typography variant="subtitle2" fontWeight={700} mb={1.5}>
                    {editTarget ? 'Sửa thuộc tính' : 'Thêm thuộc tính'}
                </Mui.Typography>
                <Mui.Box display="flex" gap={1} alignItems="flex-start">
                    <Mui.TextField
                        size="small" label="Tên thuộc tính" placeholder="VD: CPU, RAM, Màu sắc..."
                        value={form.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <Mui.TextField
                        size="small" label="Giá trị" placeholder="VD: AMD Zen 2, 16GB..."
                        value={form.gia_tri}
                        onChange={(e) => handleFormChange('gia_tri', e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <Mui.Button
                        variant="contained" size="small"
                        onClick={onSubmit} disabled={submitting}
                        startIcon={submitting ? <Mui.CircularProgress size={14} /> : (editTarget ? <Icon.Save /> : <Icon.Add />)}
                        sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                    >
                        {editTarget ? 'Lưu' : 'Thêm'}
                    </Mui.Button>
                    {editTarget && (
                        <Mui.Button variant="outlined" size="small" onClick={closeEdit} sx={{ fontWeight: 700 }}>
                            Huỷ
                        </Mui.Button>
                    )}
                </Mui.Box>
            </Mui.Paper>

            {loading ? (
                <Mui.LinearProgress />
            ) : chiTiets.length === 0 ? (
                <Mui.Typography color="text.secondary" variant="body2" textAlign="center" py={3}>
                    Chưa có thuộc tính nào
                </Mui.Typography>
            ) : (
                <Mui.Table size="small">
                    <Mui.TableHead>
                        <Mui.TableRow>
                            <Mui.TableCell sx={{ fontWeight: 700 }}>Thuộc tính</Mui.TableCell>
                            <Mui.TableCell sx={{ fontWeight: 700 }}>Giá trị</Mui.TableCell>
                            <Mui.TableCell align="right" sx={{ fontWeight: 700 }}>Thao tác</Mui.TableCell>
                        </Mui.TableRow>
                    </Mui.TableHead>
                    <Mui.TableBody>
                        {chiTiets.map(ct => (
                            <Mui.TableRow key={ct.id} hover>
                                <Mui.TableCell>
                                    <Mui.Typography variant="body2" fontWeight={600}>{ct.name}</Mui.Typography>
                                </Mui.TableCell>
                                <Mui.TableCell>
                                    <Mui.Typography variant="body2">{ct.gia_tri}</Mui.Typography>
                                </Mui.TableCell>
                                <Mui.TableCell align="right">
                                    <Mui.IconButton size="small" color="primary" onClick={() => openEdit(ct)}>
                                        <Icon.EditOutlined fontSize="small" />
                                    </Mui.IconButton>
                                    <Mui.IconButton size="small" color="error" onClick={() => setConfirmDelete(ct)}>
                                        <Icon.DeleteOutlined fontSize="small" />
                                    </Mui.IconButton>
                                </Mui.TableCell>
                            </Mui.TableRow>
                        ))}
                    </Mui.TableBody>
                </Mui.Table>
            )}

            <Mui.Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
                <Mui.DialogTitle fontWeight={900}>Xác nhận xóa</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.Typography>Xóa thuộc tính <strong>{confirmDelete?.name}</strong>?</Mui.Typography>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Mui.Button onClick={() => setConfirmDelete(null)}>Huỷ</Mui.Button>
                    <Mui.Button color="error" variant="contained" onClick={() => onDelete(confirmDelete.id)} sx={{ fontWeight: 700 }}>Xóa</Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>

            <Mui.Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Mui.Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar(p => ({ ...p, open: false }))}>{snackbar.message}</Mui.Alert>
            </Mui.Snackbar>
        </Mui.Box>
    )
}

export default ChiTietSanPhamPanel