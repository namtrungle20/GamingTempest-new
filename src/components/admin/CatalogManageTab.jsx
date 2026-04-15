import { useRef } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'

const CatalogManageTab = ({ label, hook, nameField = 'name' }) => {
    const {
        items, loading, total, page, search,
        modalOpen, editTarget, form, deleteDialog, snackbar,
        setPage, setSearch, closeSnackbar,
        openCreate, openEdit, closeModal,
        handleFormChange, handleSubmit,
        openDeleteDialog, closeDeleteDialog, handleDelete,
    } = hook

    const fileInputRef = useRef(null)
    const pageSize = 10
    const totalPages = Math.ceil(total / pageSize)

    return (
        <Mui.Box>
            {/* Header */}
            <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Mui.Typography variant="body1" color="text.secondary">
                    Tổng cộng {total} {label.toLowerCase()}
                </Mui.Typography>
                <Mui.Button
                    variant="contained"
                    startIcon={<Icon.Add />}
                    onClick={openCreate}
                    sx={{ fontWeight: 700, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
                >
                    Thêm {label.toLowerCase()}
                </Mui.Button>
            </Mui.Box>

            {/* Search */}
            <Mui.Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Mui.TextField
                    fullWidth size="small"
                    placeholder={`Tìm kiếm ${label.toLowerCase()}...`}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
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
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Tên</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</Mui.TableCell>
                            </Mui.TableRow>
                        </Mui.TableHead>
                        <Mui.TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <Mui.TableRow key={i}>
                                        {[...Array(3)].map((_, j) => (
                                            <Mui.TableCell key={j}><Mui.Skeleton /></Mui.TableCell>
                                        ))}
                                    </Mui.TableRow>
                                ))
                            ) : items.length === 0 ? (
                                <Mui.TableRow>
                                    <Mui.TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                        <Mui.Typography color="text.secondary">Chưa có dữ liệu</Mui.Typography>
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            ) : items.map((item) => {
                                const id = item.id
                                return (
                                    <Mui.TableRow key={id} hover>
                                        <Mui.TableCell>
                                            <Mui.Avatar
                                                src={item.imageUrl}
                                                variant="rounded"
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                <Icon.ImageOutlined />
                                            </Mui.Avatar>
                                        </Mui.TableCell>
                                        <Mui.TableCell>
                                            <Mui.Typography variant="body2" fontWeight={600}>
                                                {item[nameField]}
                                            </Mui.Typography>
                                        </Mui.TableCell>
                                        <Mui.TableCell align="right">
                                            <Mui.IconButton size="small" onClick={() => openEdit(item)} color="primary">
                                                <Icon.EditOutlined fontSize="small" />
                                            </Mui.IconButton>
                                            <Mui.IconButton size="small" onClick={() => openDeleteDialog(id, item[nameField])} color="error">
                                                <Icon.DeleteOutlined fontSize="small" />
                                            </Mui.IconButton>
                                        </Mui.TableCell>
                                    </Mui.TableRow>
                                )
                            })}
                        </Mui.TableBody>
                    </Mui.Table>
                </Mui.TableContainer>

                {totalPages > 1 && (
                    <Mui.Box display="flex" justifyContent="center" p={2} borderTop="1px solid" borderColor="divider">
                        <Mui.Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
                    </Mui.Box>
                )}
            </Mui.Paper>

            {/* Modal */}
            <Mui.Modal open={modalOpen} onClose={closeModal} closeAfterTransition>
                <Mui.Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 440 },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: UI_SETTING.MODAL.PADDING,
                    borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
                    outline: 'none',
                    borderTop: '5px solid',
                    borderColor: 'primary.main',
                }}>
                    <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Mui.Typography variant="h6" fontWeight={900}>
                            {editTarget ? `Cập nhật ${label.toLowerCase()}` : `Thêm ${label.toLowerCase()}`}
                        </Mui.Typography>
                        <Mui.IconButton onClick={closeModal}><Icon.Close /></Mui.IconButton>
                    </Mui.Box>

                    <Mui.Stack spacing={2.5}>
                        <Mui.TextField
                            fullWidth
                            label={`Tên ${label.toLowerCase()}`}
                            required
                            value={hook.form[nameField] || ''}
                            onChange={(e) => handleFormChange(nameField, e.target.value)}
                        />

                        {/* Upload ảnh */}
                        <Mui.Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                border: '2px dashed',
                                borderColor: form.image ? 'primary.main' : 'divider',
                                borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer',
                                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                            }}
                        >
                            {form.image ? (
                                <Mui.Box>
                                    <Icon.CheckCircle color="primary" />
                                    <Mui.Typography variant="body2" color="primary.main" mt={1}>
                                        {form.image.name}
                                    </Mui.Typography>
                                </Mui.Box>
                            ) : (
                                <Mui.Box>
                                    <Icon.CloudUpload color="disabled" sx={{ fontSize: 40 }} />
                                    <Mui.Typography variant="body2" color="text.secondary" mt={1}>
                                        {editTarget ? 'Chọn ảnh mới (tuỳ chọn)' : 'Chọn ảnh (tuỳ chọn)'}
                                    </Mui.Typography>
                                </Mui.Box>
                            )}
                        </Mui.Box>
                        <input
                            ref={fileInputRef}
                            type="file" accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => handleFormChange('image', e.target.files[0])}
                        />

                        <Mui.Box display="flex" gap={2} pt={1}>
                            <Mui.Button fullWidth variant="outlined" onClick={closeModal} sx={{ fontWeight: 700 }}>
                                Huỷ
                            </Mui.Button>
                            <Mui.Button fullWidth variant="contained" onClick={handleSubmit} sx={{ fontWeight: 700 }}>
                                {editTarget ? 'Cập nhật' : 'Thêm mới'}
                            </Mui.Button>
                        </Mui.Box>
                    </Mui.Stack>
                </Mui.Box>
            </Mui.Modal>

            {/* Dialog Xóa */}
            <Mui.Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
                <Mui.DialogTitle fontWeight={900}>Xác nhận xóa</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.Typography>
                        Bạn có chắc muốn xóa <strong>{deleteDialog.name}</strong>?
                    </Mui.Typography>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Mui.Button onClick={closeDeleteDialog}>Huỷ</Mui.Button>
                    <Mui.Button onClick={handleDelete} color="error" variant="contained" sx={{ fontWeight: 700 }}>
                        Xóa
                    </Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>

            {/* Snackbar */}
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
        </Mui.Box>
    )
}

export default CatalogManageTab