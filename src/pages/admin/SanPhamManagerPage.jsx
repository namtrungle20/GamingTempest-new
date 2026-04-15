import { useRef, useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'

// Hook quản lý sản phẩm
import useSanPhamManage from '@/hook/admin/useSanPhamManage'

// Các hook quản lý danh mục con
import useThuongHieuManage from '@/hook/admin/useThuongHieuManager'
import useLoaiSPManage from '@/hook/admin/useLoaiSPManager'
import useDanhMucManage from '@/hook/admin/useDanhMucManager'

// Component hiển thị tab CRUD chung
import CatalogManageTab from '@/components/admin/CatalogManageTab'
import LoaiSPTab from '@/components/admin/category/LoaiSPTab'

import ProductImageManager from '@/components/admin/product/ProductImageManager';
import ProductImageManagerModal from '@/components/admin/product/ProductImageManagerModal';

const SanPhamManagePage = () => {
    const [tab, setTab] = useState(0)

    // Khởi tạo các hook
    const sanPhamHook = useSanPhamManage()
    const thuongHieuHook = useThuongHieuManage()
    const loaiSanPhamHook = useLoaiSPManage()
    const danhMucHook = useDanhMucManage()

    // Lấy dữ liệu từ hook sản phẩm
    const {
        sanPhams, brands, categories, loading, total, page, search,
        modalOpen, editTarget, form, deleteDialog, snackbar,
        setPage, setSearch, closeSnackbar,
        openCreate, openEdit, closeModal,
        handleFormChange, handleSubmit,
        openDeleteDialog, closeDeleteDialog, handleDelete,
    } = sanPhamHook

    // const fileInputRef = useRef(null)
    const totalPages = Math.ceil(total / 10)

    return (
        <Mui.Box>
            <Mui.Box mb={3}>
                <Mui.Typography variant="h5" fontWeight={900} color="text.primary">
                    Quản lý sản phẩm
                </Mui.Typography>
            </Mui.Box>

            <Mui.Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Mui.Tab label="Sản phẩm" sx={{ fontWeight: 700 }} />
                <Mui.Tab label="Thương hiệu" sx={{ fontWeight: 700 }} />
                <Mui.Tab label="Loại sản phẩm" sx={{ fontWeight: 700 }} />
                <Mui.Tab label="Danh mục" sx={{ fontWeight: 700 }} />
            </Mui.Tabs>

            {/* TAB SẢN PHẨM */}
            {tab === 0 && (
                <Mui.Box>
                    <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Mui.Typography variant="body1" color="text.secondary">
                            Tổng cộng {total} sản phẩm
                        </Mui.Typography>
                        <Mui.Button variant="contained" startIcon={<Icon.Add />} onClick={openCreate} sx={{ fontWeight: 700, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}>
                            Thêm sản phẩm
                        </Mui.Button>
                    </Mui.Box>

                    <Mui.Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Mui.TextField
                            fullWidth size="small" placeholder="Tìm kiếm sản phẩm..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            InputProps={{ startAdornment: <Mui.InputAdornment position="start"><Icon.Search /></Mui.InputAdornment> }}
                        />
                    </Mui.Paper>

                    <Mui.Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                        <Mui.TableContainer>
                            <Mui.Table>
                                <Mui.TableHead>
                                    <Mui.TableRow sx={{ bgcolor: 'background.paper' }}>
                                        <Mui.TableCell sx={{ fontWeight: 700 }}>Sản phẩm</Mui.TableCell>
                                        <Mui.TableCell sx={{ fontWeight: 700 }}>Loại</Mui.TableCell>
                                        <Mui.TableCell sx={{ fontWeight: 700 }}>Thương hiệu</Mui.TableCell>
                                        <Mui.TableCell sx={{ fontWeight: 700 }}>Giá</Mui.TableCell>
                                        <Mui.TableCell sx={{ fontWeight: 700 }}>Tồn kho</Mui.TableCell>
                                        <Mui.TableCell sx={{ fontWeight: 700 }}>Hình ảnh</Mui.TableCell>
                                        <Mui.TableCell sx={{ fontWeight: 700 }} align="right">Thao tác</Mui.TableCell>
                                    </Mui.TableRow>
                                </Mui.TableHead>
                                <Mui.TableBody>
                                    {loading ? (
                                        [...Array(5)].map((_, i) => (
                                            <Mui.TableRow key={i}>
                                                {[...Array(6)].map((_, j) => (<Mui.TableCell key={j}><Mui.Skeleton /></Mui.TableCell>))}
                                            </Mui.TableRow>
                                        ))
                                    ) : sanPhams.length === 0 ? (
                                        <Mui.TableRow><Mui.TableCell colSpan={6} align="center" sx={{ py: 6 }}><Mui.Typography color="text.secondary">Không có sản phẩm nào</Mui.Typography></Mui.TableCell></Mui.TableRow>
                                    ) : (
                                        sanPhams.map((sp) => (
                                            <Mui.TableRow key={sp.id} hover>
                                                <Mui.TableCell>
                                                    <Mui.Box display="flex" alignItems="center" gap={2}>
                                                        <Mui.Avatar src={sp.imageUrl} variant="rounded" sx={{ width: 48, height: 48 }}><Icon.Inventory2 /></Mui.Avatar>
                                                        <Mui.Box>
                                                            <Mui.Typography variant="body2" fontWeight={600}>{sp.name}</Mui.Typography>
                                                            <Mui.Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>{sp.mota || '—'}</Mui.Typography>
                                                        </Mui.Box>
                                                    </Mui.Box>
                                                </Mui.TableCell>
                                                <Mui.TableCell><Mui.Chip label={sp.loai || '—'} size="small" /></Mui.TableCell>
                                                <Mui.TableCell><Mui.Chip label={sp.thuonghieu || '—'} size="small" variant="outlined" /></Mui.TableCell>
                                                <Mui.TableCell><Mui.Typography variant="body2" fontWeight={700} color="primary.main">{sp.price}</Mui.Typography></Mui.TableCell>
                                                <Mui.TableCell><Mui.Chip label={sp.soluong} size="small" color={sp.stockStatus} /></Mui.TableCell>
                                                <Mui.TableCell align="center">
                                                    <ProductImageManagerModal sanpham_id={sp.id} productName={sp.name} />
                                                </Mui.TableCell>
                                                <Mui.TableCell align="right">
                                                    <Mui.IconButton size="small" onClick={() => openEdit(sp)} color="primary"><Icon.EditOutlined fontSize="small" /></Mui.IconButton>
                                                    <Mui.IconButton size="small" onClick={() => openDeleteDialog(sp.id, sp.name)} color="error"><Icon.DeleteOutlined fontSize="small" /></Mui.IconButton>
                                                </Mui.TableCell>
                                            </Mui.TableRow>
                                        ))
                                    )}
                                </Mui.TableBody>
                            </Mui.Table>
                        </Mui.TableContainer>
                        {totalPages > 1 && (
                            <Mui.Box display="flex" justifyContent="center" p={2} borderTop="1px solid" borderColor="divider">
                                <Mui.Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
                            </Mui.Box>
                        )}
                    </Mui.Paper>

                    {/* Modal Thêm/Sửa sản phẩm */}
                    <Mui.Modal open={modalOpen} onClose={closeModal} closeAfterTransition>
                        <Mui.Box sx={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', sm: 560 }, bgcolor: 'background.paper', boxShadow: 24,
                            p: UI_SETTING.MODAL.PADDING, borderRadius: UI_SETTING.SHAPE.CARD_RADIUS, outline: 'none',
                            borderTop: '5px solid', borderColor: 'primary.main', maxHeight: '90vh', overflowY: 'auto',
                        }}>
                            <Mui.Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Mui.Typography variant="h6" fontWeight={900}>{editTarget ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</Mui.Typography>
                                <Mui.IconButton onClick={closeModal}><Icon.Close /></Mui.IconButton>
                            </Mui.Box>
                            {/* <Mui.Stack spacing={2.5}>
                                <Mui.TextField fullWidth label="Tên sản phẩm" required value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} />
                                <Mui.TextField fullWidth label="Mô tả" multiline rows={3} value={form.mota} onChange={(e) => handleFormChange('mota', e.target.value)} />
                                <Mui.Box display="flex" gap={2}>
                                    <Mui.TextField fullWidth label="Giá (VNĐ)" type="number" value={form.gia} onChange={(e) => handleFormChange('gia', e.target.value)} />
                                    <Mui.TextField fullWidth label="Số lượng" type="number" value={form.soluong} onChange={(e) => handleFormChange('soluong', e.target.value)} />
                                </Mui.Box>
                                <Mui.FormControl fullWidth>
                                    <Mui.InputLabel>Loại sản phẩm</Mui.InputLabel>
                                    <Mui.Select value={form.loai_id} label="Loại sản phẩm" onChange={(e) => handleFormChange('loai_id', e.target.value)}>
                                        {categories.map(c => (<Mui.MenuItem key={c.loai_id} value={c.loai_id}>{c.name}</Mui.MenuItem>))}
                                    </Mui.Select>
                                </Mui.FormControl>
                                <Mui.FormControl fullWidth>
                                    <Mui.InputLabel>Thương hiệu</Mui.InputLabel>
                                    <Mui.Select value={form.thuonghieu_id} label="Thương hiệu" onChange={(e) => handleFormChange('thuonghieu_id', e.target.value)}>
                                        {brands.map(b => (<Mui.MenuItem key={b.thuonghieu_id} value={b.thuonghieu_id}>{b.name}</Mui.MenuItem>))}
                                    </Mui.Select>
                                </Mui.FormControl>
                                <Mui.Box onClick={() => fileInputRef.current?.click()} sx={{
                                    border: '2px dashed', borderColor: form.image ? 'primary.main' : 'divider',
                                    borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer',
                                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                                }}>
                                    {form.image ? (
                                        <Mui.Box><Icon.CheckCircle color="primary" /><Mui.Typography variant="body2" color="primary.main" mt={1}>{form.image.name}</Mui.Typography></Mui.Box>
                                    ) : (
                                        <Mui.Box><Icon.CloudUpload color="disabled" sx={{ fontSize: 40 }} /><Mui.Typography variant="body2" color="text.secondary" mt={1}>{editTarget ? 'Chọn ảnh mới (tuỳ chọn)' : 'Chọn ảnh sản phẩm'}</Mui.Typography></Mui.Box>
                                    )}
                                </Mui.Box>
                                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFormChange('image', e.target.files[0])} />
                                <Mui.Box display="flex" gap={2} pt={1}>
                                    <Mui.Button fullWidth variant="outlined" onClick={closeModal} sx={{ fontWeight: 700 }}>Huỷ</Mui.Button>
                                    <Mui.Button fullWidth variant="contained" onClick={handleSubmit} sx={{ fontWeight: 700 }}>{editTarget ? 'Cập nhật' : 'Thêm mới'}</Mui.Button>
                                </Mui.Box>
                            </Mui.Stack> */}
                            <Mui.Stack spacing={2.5}>
                                <Mui.TextField fullWidth label="Tên sản phẩm" required value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} />
                                <Mui.TextField fullWidth label="Mô tả" multiline rows={3} value={form.mota} onChange={(e) => handleFormChange('mota', e.target.value)} />
                                <Mui.Box display="flex" gap={2}>
                                    <Mui.TextField fullWidth label="Giá (VNĐ)" type="number" value={form.gia} onChange={(e) => handleFormChange('gia', e.target.value)} />
                                    <Mui.TextField fullWidth label="Số lượng" type="number" value={form.soluong} onChange={(e) => handleFormChange('soluong', e.target.value)} />
                                </Mui.Box>
                                <Mui.FormControl fullWidth>
                                    <Mui.InputLabel>Loại sản phẩm</Mui.InputLabel>
                                    <Mui.Select value={form.loai_id} label="Loại sản phẩm" onChange={(e) => handleFormChange('loai_id', e.target.value)}>
                                        {categories.map(c => (<Mui.MenuItem key={c.loai_id} value={c.loai_id}>{c.name}</Mui.MenuItem>))}
                                    </Mui.Select>
                                </Mui.FormControl>
                                <Mui.FormControl fullWidth>
                                    <Mui.InputLabel>Thương hiệu</Mui.InputLabel>
                                    <Mui.Select value={form.thuonghieu_id} label="Thương hiệu" onChange={(e) => handleFormChange('thuonghieu_id', e.target.value)}>
                                        {brands.map(b => (<Mui.MenuItem key={b.thuonghieu_id} value={b.thuonghieu_id}>{b.name}</Mui.MenuItem>))}
                                    </Mui.Select>
                                </Mui.FormControl>

                                {/* Chỉ hiển thị quản lý ảnh khi sửa sản phẩm (đã có ID) */}
                                {/* {editTarget && editTarget.id && (
                                    <ProductImageManager sanpham_id={editTarget.id} />
                                )} */}

                                <Mui.Box display="flex" gap={2} pt={1}>
                                    <Mui.Button fullWidth variant="outlined" onClick={closeModal} sx={{ fontWeight: 700 }}>Huỷ</Mui.Button>
                                    <Mui.Button fullWidth variant="contained" onClick={handleSubmit} sx={{ fontWeight: 700 }}>{editTarget ? 'Cập nhật' : 'Thêm mới'}</Mui.Button>
                                </Mui.Box>
                            </Mui.Stack>
                        </Mui.Box>
                    </Mui.Modal>

                    {/* Dialog xóa sản phẩm */}
                    <Mui.Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
                        <Mui.DialogTitle fontWeight={900}>Xác nhận xóa</Mui.DialogTitle>
                        <Mui.DialogContent><Mui.Typography>Bạn có chắc muốn xóa sản phẩm <strong>{deleteDialog.name}</strong>?</Mui.Typography></Mui.DialogContent>
                        <Mui.DialogActions><Mui.Button onClick={closeDeleteDialog}>Huỷ</Mui.Button><Mui.Button onClick={handleDelete} color="error" variant="contained" sx={{ fontWeight: 700 }}>Xóa</Mui.Button></Mui.DialogActions>
                    </Mui.Dialog>

                    <Mui.Snackbar open={snackbar.open} autoHideDuration={3000} onClose={closeSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                        <Mui.Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Mui.Alert>
                    </Mui.Snackbar>
                </Mui.Box>
            )}

            {/* TAB THƯƠNG HIỆU */}
            {tab === 1 && <CatalogManageTab label="Thương hiệu" hook={thuongHieuHook} nameField="name" />}

            {/* TAB LOẠI SẢN PHẨM */}
            {tab === 2 && <LoaiSPTab label="Loại sản phẩm" hook={loaiSanPhamHook} nameField="name" />}

            {/* TAB DANH MỤC */}
            {tab === 3 && <CatalogManageTab label="Danh mục" hook={danhMucHook} nameField="ten" />}
        </Mui.Box>
    )
}

export default SanPhamManagePage