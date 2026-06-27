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
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' })
    const PAGE_SIZE = 10

    const fetchReviews = useCallback(async () => {
        setLoading(true)
        try {
            const params = { page, limit: PAGE_SIZE }
            if (filterSao > 0) params.sosao = filterSao
            if (search.trim()) params.search = search.trim()
            const res = await danhGiaService.getListAll_Admin({ page, limit: PAGE_SIZE, sosao: filterSao || undefined, search })
            setReviews(res.raw?.data || [])
            setTotal(res.raw?.total || 0)
        } catch {
            setReviews([])
        }
        setLoading(false)
    }, [page, filterSao, search])

    useEffect(() => { fetchReviews() }, [fetchReviews])

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
                <Mui.Box display="flex" gap={2} flexWrap="wrap">
                    <Mui.TextField
                        size="small" placeholder="Tìm sản phẩm hoặc người dùng..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                        sx={{ flex: 1, minWidth: 200 }}
                        InputProps={{ startAdornment: <Mui.InputAdornment position="start"><Icon.Search fontSize="small" /></Mui.InputAdornment> }}
                    />
                    <Mui.ToggleButtonGroup
                        value={filterSao} exclusive size="small"
                        onChange={(_, v) => { if (v !== null) { setFilterSao(v); setPage(1) } }}
                    >
                        <Mui.ToggleButton value={0}>Tất cả</Mui.ToggleButton>
                        {[5, 4, 3, 2, 1].map(s => (
                            <Mui.ToggleButton key={s} value={s}>
                                {s} <Icon.Star sx={{ fontSize: 14, ml: 0.3, color: 'warning.main' }} />
                            </Mui.ToggleButton>
                        ))}
                    </Mui.ToggleButtonGroup>
                </Mui.Box>
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
                                                {r.NguoiDung?.name || "?"}
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
                                            onClick={() => setDeleteDialog({ open: true, id: r.danhgia_id, name: r.nguoidung?.name })}
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