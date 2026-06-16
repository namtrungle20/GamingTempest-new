import { useRef, useState, useCallback } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import useProductImageManager from '@/hook/admin/useProductImageManager';

const ProductImageManager = ({ sanpham_id }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const { images, loading, uploading, uploadImage, deleteImage } = useProductImageManager(sanpham_id);

    const handleFileChange = async (e) => {
        if (!e.target.files?.length) return
        await uploadImage(e.target.files)
        e.target.value = ''
    }

    const handleDrop = useCallback(async (e) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (!files?.length) return
        await uploadImage(files)
    }, [uploadImage])

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
    const handleDragLeave = () => setIsDragging(false)

    return (
        <Mui.Box>
            {/* Drop zone */}
            <Mui.Box
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                    border: '2px dashed',
                    borderColor: isDragging ? 'primary.main' : 'divider',
                    borderRadius: 2,
                    p: 4,
                    mb: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragging ? 'action.hover' : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                {uploading ? (
                    <Mui.Stack alignItems="center" spacing={1}>
                        <Mui.CircularProgress size={32} />
                        <Mui.Typography variant="body2" color="text.secondary">Đang upload...</Mui.Typography>
                    </Mui.Stack>
                ) : (
                    <Mui.Stack alignItems="center" spacing={1}>
                        <Icon.CloudUploadOutlined sx={{ fontSize: 40, color: isDragging ? 'primary.main' : 'text.secondary' }} />
                        <Mui.Typography variant="body2" fontWeight={600}>
                            Kéo thả ảnh vào đây hoặc click để chọn
                        </Mui.Typography>
                        <Mui.Typography variant="caption" color="text.secondary">
                            Hỗ trợ JPG, PNG, WEBP — nhiều ảnh cùng lúc
                        </Mui.Typography>
                    </Mui.Stack>
                )}
            </Mui.Box>

            {/* Danh sách ảnh */}
            {loading ? (
                <Mui.Grid container spacing={1}>
                    {[...Array(3)].map((_, i) => (
                        <Mui.Grid item key={i}>
                            <Mui.Skeleton variant="rectangular" width={100} height={100} sx={{ borderRadius: 1 }} />
                        </Mui.Grid>
                    ))}
                </Mui.Grid>
            ) : images.length === 0 ? (
                <Mui.Typography variant="caption" color="text.secondary">
                    Chưa có ảnh nào
                </Mui.Typography>
            ) : (
                <Mui.Grid container spacing={1.5}>
                    {images.map((img, idx) => (
                        <Mui.Grid item key={img.id}>
                            <Mui.Box sx={{ position: 'relative', width: 100, height: 100 }}>
                                <Mui.CardMedia
                                    component="img"
                                    image={img.image_url}
                                    alt={`Ảnh ${idx + 1}`}
                                    sx={{
                                        width: '100%', height: '100%',
                                        objectFit: 'cover', borderRadius: 1,
                                        border: idx === 0 ? '2px solid' : '1px solid',
                                        borderColor: idx === 0 ? 'primary.main' : 'divider',
                                    }}
                                />
                                {/* Badge ảnh đại diện */}
                                {idx === 0 && (
                                    <Mui.Chip
                                        label="Đại diện"
                                        size="small"
                                        color="primary"
                                        sx={{
                                            position: 'absolute', bottom: 4, left: 4,
                                            fontSize: '0.6rem', height: 18,
                                        }}
                                    />
                                )}
                                <Mui.IconButton
                                    size="small"
                                    onClick={() => deleteImage(img.id)}
                                    sx={{
                                        position: 'absolute', top: 2, right: 2,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        '&:hover': { bgcolor: 'error.main' },
                                        p: 0.3,
                                    }}
                                >
                                    <Icon.Close sx={{ color: 'white', fontSize: 14 }} />
                                </Mui.IconButton>
                            </Mui.Box>
                        </Mui.Grid>
                    ))}
                </Mui.Grid>
            )}
        </Mui.Box>
    )
}

export default ProductImageManager