import { useState } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import useProductImageManager from '@/hook/admin/useProductImageManager';
import ImageLibrary from '@/components/admin/image/ImageLibrary';

const ProductImageManagerModal = ({ sanpham_id, productName }) => {
    const [open, setOpen] = useState(false);
    const { images, loading, deleteImage, refetch } = useProductImageManager(sanpham_id);

    return (
        <>
            <Mui.IconButton size="small" onClick={() => setOpen(true)} color="primary">
                <Icon.ImageOutlined fontSize="small" />
            </Mui.IconButton>
            <Mui.Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <Mui.DialogTitle>
                    Quản lý hình ảnh: {productName}
                    <Mui.IconButton
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                        onClick={() => setOpen(false)}
                    >
                        <Icon.Close />
                    </Mui.IconButton>
                </Mui.DialogTitle>

                <Mui.DialogContent dividers>

                    {/* ── Ảnh đã gán cho sản phẩm ── */}
                    <Mui.Typography variant="subtitle2" fontWeight={800} mb={1.5}>
                        Ảnh hiện tại ({images.length})
                    </Mui.Typography>

                    {loading ? (
                        <Mui.Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                            {[...Array(3)].map((_, i) => (
                                <Mui.Skeleton key={i} variant="rectangular" width={90} height={90} sx={{ borderRadius: 1.5 }} />
                            ))}
                        </Mui.Box>
                    ) : images.length === 0 ? (
                        <Mui.Box sx={{
                            py: 3, mb: 3, textAlign: 'center',
                            border: '1px dashed', borderColor: 'divider', borderRadius: 2,
                        }}>
                            <Icon.ImageNotSupported sx={{ fontSize: 32, color: 'text.disabled' }} />
                            <Mui.Typography variant="body2" color="text.secondary" mt={0.5}>
                                Sản phẩm chưa có ảnh nào — chọn từ thư viện bên dưới
                            </Mui.Typography>
                        </Mui.Box>
                    ) : (
                        <Mui.Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                            {images.map((img, idx) => (
                                <Mui.Box key={img.id} sx={{ position: 'relative', width: 90, height: 90 }}>
                                    <Mui.Box
                                        component="img"
                                        src={img.image_url}
                                        sx={{
                                            width: '100%', height: '100%',
                                            objectFit: 'cover', borderRadius: 1.5,
                                            border: idx === 0 ? '2px solid' : '1px solid',
                                            borderColor: idx === 0 ? 'primary.main' : 'divider',
                                        }}
                                    />
                                    {idx === 0 && (
                                        <Mui.Chip
                                            label="Đại diện" size="small" color="primary"
                                            sx={{ position: 'absolute', bottom: 4, left: 4, fontSize: '0.6rem', height: 18 }}
                                        />
                                    )}
                                    <Mui.IconButton
                                        size="small"
                                        onClick={() => deleteImage(img.id)}
                                        sx={{
                                            position: 'absolute', top: 2, right: 2,
                                            bgcolor: 'rgba(0,0,0,0.6)', color: 'white', p: 0.3,
                                            '&:hover': { bgcolor: 'error.main' },
                                        }}
                                    >
                                        <Icon.Close sx={{ fontSize: 14 }} />
                                    </Mui.IconButton>
                                </Mui.Box>
                            ))}
                        </Mui.Box>
                    )}

                    <Mui.Divider sx={{ mb: 2 }} />

                    {/* ── Thư viện để chọn / upload thêm ── */}
                    <Mui.Typography variant="subtitle2" fontWeight={800} mb={1.5}>
                        Thư viện ảnh — bấm vào ảnh để gán vào sản phẩm
                    </Mui.Typography>
                    <ImageLibrary sanpham_id={sanpham_id} onAssign={refetch} />

                </Mui.DialogContent>
            </Mui.Dialog>
        </>
    );
};

export default ProductImageManagerModal;