import { useState, useEffect, useCallback, useRef } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'
import { toast } from 'sonner'

const ImageLibrary = ({ onAssign, sanpham_id }) => {
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [assigning, setAssigning] = useState(null)
    const [deleting, setDeleting] = useState(null)
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState(null)
    const fileInputRef = useRef(null)

    const fetchImages = useCallback(async () => {
        setLoading(true)
        try {
            const res = await apiConfig.get(API.IMAGES.CLOUDINARY_ALL)
            setImages(res.data.images || [])
        } catch { toast.error('Lỗi tải danh sách ảnh') }
        finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchImages() }, [fetchImages])

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files || [])
        if (!files.length) return
        setUploading(true)
        try {
            const formData = new FormData()
            files.forEach(file => formData.append('images', file))
            const res = await apiConfig.post(API.IMAGES.UPLOAD_LIBRARY, formData)
            const newImages = (res.data.data || []).map(img => ({
                url: img.url, public_id: img.public_id, created_at: new Date()
            }))
            setImages(prev => [...newImages, ...prev])
            toast.success(`Upload ${newImages.length} ảnh thành công`)
        } catch {
            toast.error('Lỗi upload ảnh')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const handleAssign = async (img) => {
        if (!sanpham_id) { toast.error('Chọn sản phẩm trước'); return }
        setAssigning(img.public_id)
        try {
            await apiConfig.post(API.IMAGES.ASSIGN, { sanpham_id, image_url: img.url, public_id: img.public_id })
            toast.success('Gán ảnh thành công')
            onAssign?.()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi gán ảnh')
        } finally { setAssigning(null) }
    }

    // Mở dialog xác nhận xóa
    const requestDelete = (e, img) => {
        e.stopPropagation() // không trigger handleAssign khi bấm nút xóa
        setDeleteTarget(img)
    }

    const confirmDelete = async () => {
        if (!deleteTarget) return
        setDeleting(deleteTarget.public_id)
        try {
            await apiConfig.delete(API.IMAGES.DELETE, { data: { url: deleteTarget.url } })
            setImages(prev => prev.filter(img => img.public_id !== deleteTarget.public_id))
            toast.success('Xóa ảnh thành công')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi xóa ảnh')
        } finally {
            setDeleting(null)
            setDeleteTarget(null)
        }
    }

    const filtered = images.filter(img =>
        img.public_id?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <Mui.Box>
            {/* Toolbar */}
            <Mui.Stack direction="row" spacing={1} mb={2} alignItems="center">
                <Mui.TextField
                    size="small" placeholder="Tìm ảnh..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <Mui.InputAdornment position="start"><Icon.Search fontSize="small" /></Mui.InputAdornment> }}
                    sx={{ flex: 1 }}
                />
                <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />
                <Mui.Button
                    variant="outlined"
                    startIcon={uploading ? <Mui.CircularProgress size={16} /> : <Icon.CloudUploadOutlined />}
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                    {uploading ? 'Đang upload...' : 'Upload ảnh'}
                </Mui.Button>
                <Mui.IconButton onClick={fetchImages} size="small"><Icon.Refresh /></Mui.IconButton>
            </Mui.Stack>

            {/* Grid ảnh */}
            {loading ? (
                <Mui.Grid container spacing={1}>
                    {[...Array(12)].map((_, i) => (
                        <Mui.Grid item key={i} xs={4} sm={3} md={2}>
                            <Mui.Skeleton variant="rectangular" sx={{ aspectRatio: '1', borderRadius: 1 }} />
                        </Mui.Grid>
                    ))}
                </Mui.Grid>
            ) : filtered.length === 0 ? (
                <Mui.Box textAlign="center" py={6}>
                    <Icon.ImageNotSupported sx={{ fontSize: 48, color: 'text.disabled' }} />
                    <Mui.Typography color="text.secondary" mt={1}>Chưa có ảnh nào</Mui.Typography>
                </Mui.Box>
            ) : (
                <Mui.Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 1.5,
                }}>
                    {filtered.map((img) => (
                        <Mui.Box
                            key={img.public_id}
                            onClick={() => sanpham_id && handleAssign(img)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 0.5,
                                p: 0.75,
                                borderRadius: 1.5,
                                cursor: sanpham_id ? 'pointer' : 'default',
                                border: '2px solid transparent',
                                transition: 'all 0.15s',
                                position: 'relative',
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    borderColor: sanpham_id ? 'primary.main' : 'transparent',
                                },
                                '&:hover .delete-btn': { opacity: 1 },
                            }}
                        >
                            <Mui.Box sx={{
                                width: '100%',
                                aspectRatio: '1',
                                borderRadius: 1,
                                overflow: 'hidden',
                                bgcolor: 'background.default',
                                position: 'relative',
                            }}>
                                <Mui.Box
                                    component="img"
                                    src={img.url}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {assigning === img.public_id && (
                                    <Mui.Box sx={{
                                        position: 'absolute', inset: 0,
                                        bgcolor: 'rgba(0,0,0,0.5)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Mui.CircularProgress size={20} sx={{ color: 'white' }} />
                                    </Mui.Box>
                                )}

                                {/* Nút xóa — hiện khi hover */}
                                <Mui.IconButton
                                    className="delete-btn"
                                    size="small"
                                    onClick={(e) => requestDelete(e, img)}
                                    disabled={deleting === img.public_id}
                                    sx={{
                                        position: 'absolute', top: 4, right: 4,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        opacity: 0,
                                        transition: 'opacity 0.15s',
                                        p: 0.4,
                                        '&:hover': { bgcolor: 'error.main' },
                                    }}
                                >
                                    {deleting === img.public_id
                                        ? <Mui.CircularProgress size={14} sx={{ color: 'white' }} />
                                        : <Icon.Close sx={{ fontSize: 14 }} />
                                    }
                                </Mui.IconButton>
                            </Mui.Box>
                            <Mui.Typography variant="caption" textAlign="center" sx={{
                                fontSize: '0.65rem', color: 'text.secondary',
                                overflow: 'hidden', textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap', width: '100%', display: 'block',
                            }}>
                                {img.public_id?.split('/').pop()}
                            </Mui.Typography>
                        </Mui.Box>
                    ))}
                </Mui.Box>
            )}

            {/* Dialog xác nhận xóa */}
            <Mui.Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                <Mui.DialogTitle fontWeight={900}>Xác nhận xóa ảnh</Mui.DialogTitle>
                <Mui.DialogContent>
                    <Mui.Box sx={{ width: 160, aspectRatio: '1', borderRadius: 1, overflow: 'hidden', mb: 2 }}>
                        <Mui.Box component="img" src={deleteTarget?.url} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Mui.Box>
                    <Mui.Typography>
                        Ảnh đang được dùng cho sản phẩm sẽ <strong>không thể xóa</strong>. Bạn có chắc muốn xóa ảnh này?
                    </Mui.Typography>
                </Mui.DialogContent>
                <Mui.DialogActions>
                    <Mui.Button onClick={() => setDeleteTarget(null)}>Huỷ</Mui.Button>
                    <Mui.Button onClick={confirmDelete} color="error" variant="contained" sx={{ fontWeight: 700 }}>
                        Xóa
                    </Mui.Button>
                </Mui.DialogActions>
            </Mui.Dialog>
        </Mui.Box>
    )
}

export default ImageLibrary