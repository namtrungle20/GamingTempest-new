import { useEffect, useRef, useState } from 'react'
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
import ChiTietSanPhamPanel from '@/components/admin/product/ChiTietSanPhamPanel'

// import ProductImageManager from '@/components/admin/product/ProductImageManager';
import ProductImageManagerModal from '@/components/admin/product/ProductImageManagerModal';
import ImageLibrary from '@/components/admin/image/ImageLibrary'
import MotaEditor from '@/components/admin/product/MotaEditor'

const SanPhamManagePage = () => {
    const [tab, setTab] = useState(0)
    const fileInputRef = useRef(null)
    const [importing, setImporting] = useState(false)
    const [selectedSP, setSelectedSP] = useState(null)
    const [chiTietSearch, setChiTietSearch] = useState('')

    // const bulkUploadRef = useRef(null)
    // const [bulkUploading, setBulkUploading] = useState(false)

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
        openDeleteDialog, closeDeleteDialog, handleDelete, handleImport,
        allSanPhams, allLoading, allPage, allTotal, allSearch,
        setAllPage, setAllSearch, fetchAllSanPhams,
    } = sanPhamHook

    // const fileInputRef = useRef(null)
    const totalPages = Math.ceil(total / 10)

    const onFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImporting(true)
        await handleImport(file)
        setImporting(false)
        e.target.value = ''
    }

    useEffect(() => {
        if (tab === 5) fetchAllSanPhams('', 1)
    }, [tab])

    // const onBulkUpload = async (e) => {
    //     const files = Array.from(e.target.files)
    //     if (!files.length) return
    //     setBulkUploading(true)
    //     await handleBulkUpload(files)
    //     setBulkUploading(false)
    //     e.target.value = ''
    // }

    return (
        <Mui.Box>
            <Mui.Box mb={3}>
                <Mui.Typography variant="h5" fontWeight={900} color="text.primary">
                    Quản lý sản phẩm
                </Mui.Typography>
            </Mui.Box>

            <Mui.Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Mui.Tab label="Sản phẩm" icon={<Icon.VideogameAssetOutlined />} iconPosition="start" sx={{ fontWeight: 700 }} />
                <Mui.Tab label="Thương hiệu" icon={<Icon.Label />} iconPosition="start" sx={{ fontWeight: 700 }} />
                <Mui.Tab label="Loại sản phẩm" icon={<Icon.Category />} iconPosition="start" sx={{ fontWeight: 700 }} />
                <Mui.Tab label="Danh mục" icon={<Icon.Category />} iconPosition="start" sx={{ fontWeight: 700 }} />
                <Mui.Tab label="Thư viện ảnh" icon={<Icon.Collections />} iconPosition="start" sx={{ fontWeight: 700 }} />
                <Mui.Tab label="Chi tiết sản phẩm" icon={<Icon.Settings />} iconPosition="start" sx={{ fontWeight: 700 }} />
            </Mui.Tabs>

            {/* TAB SẢN PHẨM */}
            {tab === 0 && (
                <Mui.Box>
                    <Mui.Box display="flex" gap={1}>
                        {/* ✅ Nút import */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            style={{ display: 'none' }}
                            onChange={onFileChange}
                        />
                        <Mui.Button
                            variant="outlined"
                            startIcon={importing ? <Mui.CircularProgress size={16} /> : <Icon.UploadFileOutlined />}
                            disabled={importing}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ fontWeight: 700, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}
                        >
                            {importing ? 'Đang import...' : 'Import Excel'}
                        </Mui.Button>


                        <Mui.Button variant="contained" startIcon={<Icon.Add />} onClick={openCreate}
                            sx={{ fontWeight: 700, borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS }}>
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
                                                <Mui.TableCell align="left">
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

                            <Mui.Stack spacing={2.5}>
                                <Mui.TextField fullWidth label="Tên sản phẩm" required value={form.name} onChange={(e) => handleFormChange('name', e.target.value)} />
                                <MotaEditor
                                    value={form.mota}
                                    onChange={(val) => handleFormChange('mota', val)}
                                    rows={5}
                                />
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

                                {editTarget && editTarget.id && (
                                    <Mui.Box>
                                        <Mui.Divider sx={{ my: 1 }} />
                                        <Mui.Typography variant="subtitle2" fontWeight={700} mb={1}>
                                            Thông số kỹ thuật
                                        </Mui.Typography>
                                        <ChiTietSanPhamPanel sanpham_id={editTarget.id} />
                                    </Mui.Box>
                                )}

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
            {tab === 3 && <CatalogManageTab label="Danh mục" hook={danhMucHook} nameField="name" />}

            {tab === 4 && (
                <Mui.Box>
                    <Mui.Typography variant="h6" fontWeight={700} mb={2}>Thư viện ảnh</Mui.Typography>
                    <ImageLibrary />
                </Mui.Box>
            )}
            {tab === 5 && (
                <Mui.Box display="flex" gap={2} height="70vh">
                    <Mui.Paper elevation={0} sx={{
                        width: 300, flexShrink: 0,
                        border: '1px solid', borderColor: 'divider',
                        borderRadius: 2, overflow: 'hidden',
                        display: 'flex', flexDirection: 'column'
                    }}>
                        {/* Search — gọi API */}
                        <Mui.Box p={2} borderBottom="1px solid" borderColor="divider">
                            <Mui.TextField
                                fullWidth size="small" placeholder="Tìm sản phẩm..."
                                value={allSearch}
                                onChange={(e) => setAllSearch(e.target.value)}
                                InputProps={{ startAdornment: <Mui.InputAdornment position="start"><Icon.Search /></Mui.InputAdornment> }}
                            />
                        </Mui.Box>

                        {/* Danh sách */}
                        <Mui.List dense sx={{ overflow: 'auto', flex: 1, p: 0 }}>
                            {allLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <Mui.ListItem key={i}><Mui.Skeleton width="100%" /></Mui.ListItem>
                                ))
                            ) : allSanPhams.map(sp => (
                                <Mui.ListItemButton
                                    key={sp.id}
                                    selected={selectedSP?.id === sp.id}
                                    onClick={() => setSelectedSP(sp)}
                                    sx={{
                                        borderBottom: '1px solid', borderColor: 'divider',
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.main', color: 'white',
                                            '&:hover': { bgcolor: 'primary.dark' }
                                        }
                                    }}
                                >
                                    <Mui.ListItemAvatar>
                                        <Mui.Avatar src={sp.imageUrl} variant="rounded" sx={{ width: 36, height: 36 }}>
                                            <Icon.Inventory2 fontSize="small" />
                                        </Mui.Avatar>
                                    </Mui.ListItemAvatar>
                                    <Mui.ListItemText
                                        primary={<Mui.Typography variant="body2" fontWeight={600} noWrap>{sp.name}</Mui.Typography>}
                                        secondary={<Mui.Typography variant="caption" sx={{ color: selectedSP?.id === sp.id ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>{sp.id}</Mui.Typography>}
                                    />
                                </Mui.ListItemButton>
                            ))}
                        </Mui.List>

                        {/* Pagination */}
                        {Math.ceil(allTotal / 10) > 1 && (
                            <Mui.Box p={1} borderTop="1px solid" borderColor="divider" display="flex" justifyContent="center">
                                <Mui.Pagination
                                    count={Math.ceil(allTotal / 10)}
                                    page={allPage}
                                    onChange={(_, val) => setAllPage(val)}
                                    size="small"
                                    color="primary"
                                />
                            </Mui.Box>
                        )}
                    </Mui.Paper>

                    {/* Cột phải — chi tiết */}
                    <Mui.Paper elevation={0} sx={{
                        flex: 1, border: '1px solid', borderColor: 'divider',
                        borderRadius: 2, overflow: 'auto', p: 2
                    }}>
                        {selectedSP ? (
                            <Mui.Box>
                                <Mui.Box display="flex" alignItems="center" gap={2} mb={2}>
                                    <Mui.Avatar src={selectedSP.imageUrl} variant="rounded" sx={{ width: 48, height: 48 }}>
                                        <Icon.Inventory2 />
                                    </Mui.Avatar>
                                    <Mui.Box>
                                        <Mui.Typography variant="h6" fontWeight={700}>{selectedSP.name}</Mui.Typography>
                                        <Mui.Typography variant="caption" color="text.secondary">{selectedSP.id}</Mui.Typography>
                                    </Mui.Box>
                                </Mui.Box>
                                <Mui.Divider sx={{ mb: 2 }} />
                                <ChiTietSanPhamPanel sanpham_id={selectedSP.id} />
                            </Mui.Box>
                        ) : (
                            <Mui.Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" color="text.secondary">
                                <Icon.TouchApp sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                                <Mui.Typography>Chọn sản phẩm để xem thông số kỹ thuật</Mui.Typography>
                            </Mui.Box>
                        )}
                    </Mui.Paper>
                </Mui.Box>
            )}
        </Mui.Box>
    )
}

export default SanPhamManagePage