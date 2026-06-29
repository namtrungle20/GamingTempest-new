// components/admin/LoaiSPTab.jsx
import { useRef } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'

const LoaiSPTab = ({ hook }) => {
    const fileInputRef = useRef(null)
    const totalPages = Math.ceil(hook.total / 10)

    return (
        <Mui.Box>
            {/* Header */}
            <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Mui.Typography variant="body1" color="text.secondary">
                    Tổng cộng {hook.total} loại sản phẩm
                </Mui.Typography>
                <Mui.Button variant="contained" startIcon={<Icon.Add />} onClick={hook.openCreate}>
                    Thêm loại sản phẩm
                </Mui.Button>
            </Mui.Box>

            {/* Search */}
            <Mui.Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Mui.TextField
                    fullWidth size="small" placeholder="Tìm kiếm loại sản phẩm..."
                    value={hook.search}
                    onChange={(e) => { hook.setSearch(e.target.value); hook.setPage(1) }}
                    InputProps={{ startAdornment: <Mui.InputAdornment position="start"><Icon.Search /></Mui.InputAdornment> }}
                />
            </Mui.Paper>

            {/* Table */}
            <Mui.Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Mui.TableContainer>
                    <Mui.Table>
                        <Mui.TableHead>
                            <Mui.TableRow sx={{ bgcolor: 'background.paper' }}>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Ảnh</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Tên loại</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Danh mục cha</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</Mui.TableCell>
                            </Mui.TableRow>
                        </Mui.TableHead>
                        <Mui.TableBody>
                            {hook.loading ? (
                                [...Array(5)].map((_, i) => (
                                    <Mui.TableRow key={i}>
                                        <Mui.TableCell><Mui.Skeleton /></Mui.TableCell>
                                        <Mui.TableCell><Mui.Skeleton /></Mui.TableCell>
                                        <Mui.TableCell><Mui.Skeleton /></Mui.TableCell>
                                        <Mui.TableCell><Mui.Skeleton /></Mui.TableCell>
                                    </Mui.TableRow>
                                ))
                            ) : hook.items.length === 0 ? (
                                <Mui.TableRow>
                                    <Mui.TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                        <Mui.Typography color="text.secondary">Chưa có loại sản phẩm nào</Mui.Typography>
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            ) : (
                                hook.items.map((item) => (
                                    <Mui.TableRow key={item.id} hover>
                                        <Mui.TableCell>
                                            <Mui.Avatar src={item.imageUrl} variant="rounded" sx={{ width: 40, height: 40 }}>
                                                <Icon.ImageOutlined />
                                            </Mui.Avatar>
                                        </Mui.TableCell>
                                        <Mui.TableCell>{item.name}</Mui.TableCell>
                                        <Mui.TableCell>{item.danhmuc?.ten || '—'}</Mui.TableCell>
                                        <Mui.TableCell align="right">
                                            <Mui.IconButton size="small" onClick={() => hook.openEdit(item)} color="primary">
                                                <Icon.EditOutlined fontSize="small" />
                                            </Mui.IconButton>
                                            <Mui.IconButton size="small" onClick={() => hook.openDeleteDialog(item.id, item.name)} color="error">
                                                <Icon.DeleteOutlined fontSize="small" />
                                            </Mui.IconButton>
                                        </Mui.TableCell>
                                    </Mui.TableRow>
                                ))
                            )}
                        </Mui.TableBody>
                    </Mui.Table>
                </Mui.TableContainer>
                {totalPages > 1 && (
                    <Mui.Box display="flex" justifyContent="center" p={2} borderTop="1px solid" borderColor="divider">
                        <Mui.Pagination count={totalPages} page={hook.page} onChange={(_, val) => hook.setPage(val)} color="primary" />
                    </Mui.Box>
                )}
            </Mui.Paper>

            {/* Modal Thêm/Sửa */}
            <Mui.Modal open={hook.modalOpen} onClose={hook.closeModal} closeAfterTransition>
                <Mui.Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 500 }, bgcolor: 'background.paper', boxShadow: 24,
                    p: UI_SETTING.MODAL.PADDING, borderRadius: UI_SETTING.SHAPE.CARD_RADIUS, outline: 'none',
                    borderTop: '5px solid', borderColor: 'primary.main',
                }}>
                    <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Mui.Typography variant="h6" fontWeight={900}>
                            {hook.editTarget ? 'Cập nhật loại sản phẩm' : 'Thêm loại sản phẩm'}
                        </Mui.Typography>
                        <Mui.IconButton onClick={hook.closeModal}><Icon.Close /></Mui.IconButton>
                    </Mui.Box>
                    <Mui.Stack spacing={2.5}>
                        <Mui.TextField
                            fullWidth label="Tên loại sản phẩm"
                            value={hook.form.name || ''}
                            onChange={(e) => hook.handleFormChange('name', e.target.value)}
                        />
                        <Mui.FormControl fullWidth>
                            <Mui.InputLabel>Danh mục cha</Mui.InputLabel>
                            <Mui.Select
                                value={hook.form.danhmuc_id || ''}
                                label="Danh mục cha"
                                onChange={(e) => {
                                    hook.handleFormChange('danhmuc_id', e.target.value);
                                }}
                            >
                                <Mui.MenuItem value="">-- Chọn danh mục --</Mui.MenuItem>
                                {hook.danhMucs.map(dm => (
                                    <Mui.MenuItem key={dm.danhmuc_id} value={dm.danhmuc_id}>
                                        {dm.ten}
                                    </Mui.MenuItem>
                                ))}
                            </Mui.Select>
                        </Mui.FormControl>
                        {/* Upload ảnh (giữ nguyên) */}
                        <Mui.Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                border: '2px dashed', borderColor: hook.form.image ? 'primary.main' : 'divider',
                                borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                            }}
                        >
                            {hook.form.image ? (
                                <Mui.Box>
                                    <Icon.CheckCircle color="primary" />
                                    <Mui.Typography variant="body2" color="primary.main" mt={1}>{hook.form.image.name}</Mui.Typography>
                                </Mui.Box>
                            ) : (
                                <Mui.Box>
                                    <Icon.CloudUpload color="disabled" sx={{ fontSize: 40 }} />
                                    <Mui.Typography variant="body2" color="text.secondary" mt={1}>
                                        {hook.editTarget ? 'Chọn ảnh mới (tuỳ chọn)' : 'Chọn ảnh (tuỳ chọn)'}
                                    </Mui.Typography>
                                </Mui.Box>
                            )}
                        </Mui.Box>
                        <input
                            ref={fileInputRef} type="file" accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => hook.handleFormChange('image', e.target.files[0])}
                        />
                        <Mui.Box display="flex" gap={2} pt={1}>
                            <Mui.Button fullWidth variant="outlined" onClick={hook.closeModal}>Huỷ</Mui.Button>
                            <Mui.Button fullWidth variant="contained" onClick={hook.handleSubmit}>
                                {hook.editTarget ? 'Cập nhật' : 'Thêm mới'}
                            </Mui.Button>
                        </Mui.Box>
                    </Mui.Stack>
                </Mui.Box>
            </Mui.Modal>

            {/* Dialog xóa */}
            <Mui.Dialog open={hook.deleteDialog.open} onClose={hook.closeDeleteDialog}>
                <Mui.DialogTitle fontWeight={900}>Xác nhận xóa</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.Typography>Bạn có chắc muốn xóa loại sản phẩm <strong>{hook.deleteDialog.name}</strong>?</Mui.Typography>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Mui.Button onClick={hook.closeDeleteDialog}>Huỷ</Mui.Button>
                    <Mui.Button onClick={hook.handleDelete} color="error" variant="contained">Xóa</Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>

            {/* Snackbar */}
            <Mui.Snackbar open={hook.snackbar.open} autoHideDuration={3000} onClose={hook.closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Mui.Alert onClose={hook.closeSnackbar} severity={hook.snackbar.severity} variant="filled">{hook.snackbar.message}</Mui.Alert>
            </Mui.Snackbar>
        </Mui.Box>
    )
}

export default LoaiSPTab