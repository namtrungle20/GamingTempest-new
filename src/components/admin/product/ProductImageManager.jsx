// components/admin/ProductImageManager.jsx
import { useRef } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import useProductImageManager from '@/hook/admin/useProductImageManager';

const ProductImageManager = ({ sanpham_id }) => {
    const fileInputRef = useRef(null);
    const { images, loading, uploading, uploadImage, deleteImage } = useProductImageManager(sanpham_id);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file) {
            await uploadImage(file);  // không truyền sanpham_id
            e.target.value = '';
        }
    };

    return (
        <Mui.Box sx={{ mt: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
            <Mui.Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Quản lý hình ảnh sản phẩm
            </Mui.Typography>
            <Mui.Box display="flex" gap={2} alignItems="center" mb={2}>
                <Mui.Button
                    variant="outlined"
                    startIcon={<Icon.Add />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!sanpham_id || uploading}
                >
                    {uploading ? 'Đang upload...' : 'Thêm ảnh'}
                </Mui.Button>
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                {!sanpham_id && (
                    <Mui.Typography variant="caption" color="error">
                        * Lưu sản phẩm trước để thêm ảnh
                    </Mui.Typography>
                )}
            </Mui.Box>

            {loading ? (
                <Mui.CircularProgress size={24} />
            ) : (
                <Mui.Grid container spacing={1}>
                    {images.map((img) => (
                        <Mui.Grid item key={img.id}>
                            <Mui.Box sx={{ position: 'relative', width: 100, height: 100 }}>
                                <Mui.CardMedia
                                    component="img"
                                    image={img.image_url}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 1 }}
                                />
                                <Mui.IconButton
                                    size="small"
                                    sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)' }}
                                    onClick={() => deleteImage(img.id)}
                                >
                                    <Icon.Close sx={{ color: 'white', fontSize: 16 }} />
                                </Mui.IconButton>
                            </Mui.Box>
                        </Mui.Grid>
                    ))}
                </Mui.Grid>
            )}
        </Mui.Box>
    );
};

export default ProductImageManager;