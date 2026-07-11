import { useState, useEffect, useCallback } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import apiConfig from '@/config/apiConfig'
import { danhGiaService } from '@/services/danhgia.service'

const DanhGiaManagerPage = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [search, setSearch] = useState('')
    const [filterSao, setFilterSao] = useState(0) // 0 = tất cả
    const [tuNgay, setTuNgay] = useState('')
    const [denNgay, setDenNgay] = useState('')
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' })
    const PAGE_SIZE = 10

    const fetchReviews = useCallback(async () => {
        setLoading(true)
        try {
            const res = await danhGiaService.getListAll_Admin({
                page,
                limit: PAGE_SIZE,
                sosao: filterSao > 0 ? filterSao : undefined, // ← chỉ gửi khi chọn sao cụ thể
                search: search.trim() || undefined,
                tuNgay: tuNgay || undefined,
                denNgay: denNgay || undefined,
            })
            setReviews(res.raw?.data || [])
            setTotal(res.raw?.total || 0)
        } catch {
            setReviews([])
        }
        setLoading(false)
    }, [page, filterSao, search, tuNgay, denNgay])

    useEffect(() => { fetchReviews() }, [fetchReviews])

    const handleSearchChange = (val) => { setSearch(val); setPage(1) }
    const handleFilterSaoChange = (_, val) => { if (val !== null) { setFilterSao(val); setPage(1) } }
    const handleTuNgayChange = (val) => { setTuNgay(val); setPage(1) }
    const handleDenNgayChange = (val) => { setDenNgay(val); setPage(1) }

    const handleResetFilter = () => {
        setSearch('')
        setFilterSao(0)
        setTuNgay('')
        setDenNgay('')
        setPage(1)
    }


    const handleDelete = async () => {
        setDeleting(deleteDialog.id)
        try {
            await apiConfig.delete(`/danhgia/${deleteDialog.id}`)
            setDeleteDialog({ open: false, id: null, name: '' })
            fetchReviews()
        } catch { }
        setDeleting(null)
    }

    const totalPages = Math.ceil(total / PAGE_SIZE)
    const hasFilter = filterSao > 0 || search.trim() || tuNgay || denNgay

    const StarChip = ({ value }) => (
        <Mui.Box display="flex" alignItems="center" gap={0.5}>
            <Mui.Rating value={value} size="small" readOnly precision={0.5} />
            <Mui.Typography variant="caption" fontWeight={700}>{value}</Mui.Typography>
        </Mui.Box>
    )

    return (
        <Mui.Box>
            <Mui.Box mb={3}>
                <Mui.Typography variant="h5" fontWeight={900}>Quản lý đánh giá</Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary">{total} đánh giá</Mui.Typography>
            </Mui.Box>

            {/* Filter */}
            <Mui.Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Mui.Stack spacing={2}>
                    {/* Row 1: Search + Reset */}
                    <Mui.Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                        <Mui.TextField
                            size="small" placeholder="Tìm sản phẩm hoặc người dùng..."
                            value={search}
                            onChange={e => handleSearchChange(e.target.value)}
                            sx={{ flex: 1, minWidth: 200 }}
                            InputProps={{
                                startAdornment: (
                                    <Mui.InputAdornment position="start">
                                        <Icon.Search fontSize="small" />
                                    </Mui.InputAdornment>
                                )
                            }}
                        />
                        {hasFilter && (
                            <Mui.Button
                                size="small" variant="outlined" color="inherit"
                                startIcon={<Icon.FilterAltOff fontSize="small" />}
                                onClick={handleResetFilter}
                                sx={{ fontWeight: 700, textTransform: 'none', whiteSpace: 'nowrap' }}
                            >
                                Xoá bộ lọc
                            </Mui.Button>
                        )}
                    </Mui.Box>

                    {/* Row 2: Filter sao + Khoảng ngày */}
                    <Mui.Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                        {/* Filter số sao */}
                        <Mui.ToggleButtonGroup
                            value={filterSao} exclusive size="small"
                            onChange={handleFilterSaoChange}
                        >
                            <Mui.ToggleButton value={0}>Tất cả</Mui.ToggleButton>
                            {[5, 4, 3, 2, 1].map(s => (
                                <Mui.ToggleButton key={s} value={s}>
                                    {s} <Icon.Star sx={{ fontSize: 14, ml: 0.3, color: 'warning.main' }} />
                                </Mui.ToggleButton>
                            ))}
                        </Mui.ToggleButtonGroup>

                        <Mui.Divider orientation="vertical" flexItem />

                        {/* Filter ngày */}
                        <Mui.Box display="flex" gap={1} alignItems="center">
                            <Mui.TextField
                                size="small" type="date" label="Từ ngày"
                                value={tuNgay}
                                onChange={e => handleTuNgayChange(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ max: denNgay || undefined }}
                                sx={{ width: 160 }}
                            />
                            <Mui.Typography variant="body2" color="text.disabled">—</Mui.Typography>
                            <Mui.TextField
                                size="small" type="date" label="Đến ngày"  // ← sửa label
                                value={denNgay}   // ← sửa value
                                onChange={e => handleDenNgayChange(e.target.value)}  // ← sửa handler
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: tuNgay || undefined }}  // ← sửa min thay vì max
                                sx={{ width: 160 }}
                            />
                        </Mui.Box>
                    </Mui.Box>
                </Mui.Stack>
            </Mui.Paper>

            {/* Table */}
            <Mui.Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Mui.TableContainer>
                    <Mui.Table>
                        <Mui.TableHead>
                            <Mui.TableRow sx={{ bgcolor: 'background.paper' }}>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Người dùng</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Sản phẩm</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Đánh giá</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Bình luận</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700 }}>Ngày</Mui.TableCell>
                                <Mui.TableCell align="right" sx={{ fontWeight: 700 }}>Thao tác</Mui.TableCell>
                            </Mui.TableRow>
                        </Mui.TableHead>
                        <Mui.TableBody>
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <Mui.TableRow key={i}>
                                        {[...Array(6)].map((_, j) => (
                                            <Mui.TableCell key={j}><Mui.Skeleton /></Mui.TableCell>
                                        ))}
                                    </Mui.TableRow>
                                ))
                            ) : reviews.length === 0 ? (
                                <Mui.TableRow>
                                    <Mui.TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Mui.Typography color="text.secondary">Không có đánh giá nào</Mui.Typography>
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            ) : reviews.map(r => (
                                <Mui.TableRow key={r.danhgia_id} hover>
                                    <Mui.TableCell>
                                        <Mui.Box display="flex" alignItems="center" gap={1}>
                                            <Mui.Avatar src={r.NguoiDung?.avatar} sx={{ width: 32, height: 32 }}>
                                                {r.NguoiDung?.name?.[0]}
                                            </Mui.Avatar>
                                            <Mui.Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 120 }}>
                                                {r.NguoiDung?.name || '?'}
                                            </Mui.Typography>
                                        </Mui.Box>
                                    </Mui.TableCell>
                                    <Mui.TableCell>
                                        <Mui.Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                                            {r.SanPham?.name}
                                        </Mui.Typography>
                                    </Mui.TableCell>
                                    <Mui.TableCell>
                                        <StarChip value={r.sosao} />
                                    </Mui.TableCell>
                                    <Mui.TableCell>
                                        <Mui.Typography variant="body2" color="text.secondary"
                                            sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {r.binhluan || <em>Không có bình luận</em>}
                                        </Mui.Typography>
                                    </Mui.TableCell>
                                    <Mui.TableCell>
                                        <Mui.Typography variant="caption" color="text.secondary">
                                            {new Date(r.created_at).toLocaleDateString('vi-VN')}
                                        </Mui.Typography>
                                    </Mui.TableCell>
                                    <Mui.TableCell align="right">
                                        <Mui.IconButton
                                            size="small" color="error"
                                            onClick={() => setDeleteDialog({ open: true, id: r.danhgia_id, name: r.NguoiDung?.name })}
                                        >
                                            <Icon.DeleteOutlined fontSize="small" />
                                        </Mui.IconButton>
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            ))}
                        </Mui.TableBody>
                    </Mui.Table>
                </Mui.TableContainer>

                {totalPages > 1 && (
                    <Mui.Box display="flex" justifyContent="center" p={2} borderTop="1px solid" borderColor="divider">
                        <Mui.Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
                    </Mui.Box>
                )}
            </Mui.Paper>

            {/* Confirm delete */}
            <Mui.Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null, name: '' })}>
                <Mui.DialogTitle fontWeight={900}>Xác nhận xóa</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.Typography>
                        Xóa đánh giá của <strong>{deleteDialog.name}</strong>? Hành động này không thể hoàn tác.
                    </Mui.Typography>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Mui.Button onClick={() => setDeleteDialog({ open: false, id: null, name: '' })}>Huỷ</Mui.Button>
                    <Mui.Button
                        color="error" variant="contained"
                        onClick={handleDelete}
                        disabled={!!deleting}
                        startIcon={deleting ? <Mui.CircularProgress size={16} /> : null}
                        sx={{ fontWeight: 700 }}
                    >
                        Xóa
                    </Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>
        </Mui.Box>
    )
}

export default DanhGiaManagerPage