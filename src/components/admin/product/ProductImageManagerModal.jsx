import { useState } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import useProductImageManager from '@/hook/admin/useProductImageManager';
import ImageLibrary from '@/components/admin/image/ImageLibrary';
import { hinhAnhService, parseYoutubeUrl } from '@/services/productImage.service';

const ProductImageManagerModal = ({ sanpham_id, productName }) => {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [addingVideo, setAddingVideo] = useState(false);
    const [videoError, setVideoError] = useState('');
    const { images, loading, deleteImage, refetch } = useProductImageManager(sanpham_id);


    const mediaImages = images.filter(m => m.type !== 'video');
    const mediaVideos = images.filter(m => m.type === 'video');

    const handleAddVideo = async () => {
        setVideoError('')
        if (!youtubeUrl.trim()) {
            setVideoError('Vui lòng nhập URL YouTube')
            return
        }
        const embedUrl = parseYoutubeUrl(youtubeUrl)
        if (!embedUrl) {
            setVideoError('URL YouTube không hợp lệ. VD: https://youtu.be/xxxxx')
            return
        }
        setAddingVideo(true)
        const result = await hinhAnhService.addYoutubeVideo({ sanpham_id, youtube_url: youtubeUrl })
        if (result.success) {
            setYoutubeUrl('')
            refetch()
        } else {
            setVideoError(result.message)
        }
        setAddingVideo(false)
    }

    // Extract YouTube video ID từ embed URL để hiện thumbnail
    const getYoutubeThumbnail = (embedUrl) => {
        const match = embedUrl?.match(/embed\/([^?]+)/)
        return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null
    }

    return (
        <>
            <Mui.IconButton size="small" onClick={() => setOpen(true)} color="primary">
                <Icon.ImageOutlined fontSize="small" />
            </Mui.IconButton>

            <Mui.Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <Mui.DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Mui.Typography fontWeight={800}>Quản lý media: {productName}</Mui.Typography>
                    <Mui.IconButton onClick={() => setOpen(false)}>
                        <Icon.Close />
                    </Mui.IconButton>
                </Mui.DialogTitle>

                <Mui.DialogContent dividers sx={{ p: 0 }}>
                    {/* Tabs Ảnh / Video */}
                    <Mui.Tabs
                        value={tab} onChange={(_, v) => setTab(v)}
                        sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                        <Mui.Tab
                            label={`Hình ảnh (${mediaImages.length})`}
                            icon={<Icon.ImageOutlined sx={{ fontSize: 17 }} />}
                            iconPosition="start"
                            sx={{ fontWeight: 700, textTransform: 'none', minHeight: 48 }}
                        />
                        <Mui.Tab
                            label={`Video YouTube (${mediaVideos.length})`}
                            icon={<Icon.YouTube sx={{ fontSize: 17 }} />}
                            iconPosition="start"
                            sx={{ fontWeight: 700, textTransform: 'none', minHeight: 48 }}
                        />
                    </Mui.Tabs>

                    <Mui.Box sx={{ p: 3 }}>
                        {/* ── TAB ẢNH ── */}
                        {tab === 0 && (
                            <Mui.Box>
                                {/* Ảnh hiện tại */}
                                <Mui.Typography variant="subtitle2" fontWeight={800} mb={1.5}>
                                    Ảnh hiện tại ({mediaImages.length})
                                </Mui.Typography>

                                {loading ? (
                                    <Mui.Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                                        {[...Array(3)].map((_, i) => (
                                            <Mui.Skeleton key={i} variant="rectangular" width={90} height={90} sx={{ borderRadius: 1.5 }} />
                                        ))}
                                    </Mui.Box>
                                ) : mediaImages.length === 0 ? (
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
                                        {mediaImages.map((img, idx) => (
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

                                <Mui.Typography variant="subtitle2" fontWeight={800} mb={1.5}>
                                    Thư viện ảnh — bấm vào ảnh để gán vào sản phẩm
                                </Mui.Typography>
                                <ImageLibrary sanpham_id={sanpham_id} onAssign={refetch} />
                            </Mui.Box>
                        )}

                        {/* ── TAB VIDEO ── */}
                        {tab === 1 && (
                            <Mui.Box>
                                {/* Input thêm YouTube URL */}
                                <Mui.Typography variant="subtitle2" fontWeight={800} mb={1.5}>
                                    Thêm video YouTube
                                </Mui.Typography>

                                <Mui.Stack direction="row" spacing={1} mb={1}>
                                    <Mui.TextField
                                        fullWidth
                                        size="small"
                                        placeholder="https://youtu.be/xxxxx hoặc https://youtube.com/watch?v=xxxxx"
                                        value={youtubeUrl}
                                        onChange={(e) => { setYoutubeUrl(e.target.value); setVideoError('') }}
                                        error={!!videoError}
                                        InputProps={{
                                            startAdornment: (
                                                <Mui.InputAdornment position="start">
                                                    <Icon.YouTube sx={{ color: '#FF0000' }} />
                                                </Mui.InputAdornment>
                                            )
                                        }}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddVideo()}
                                    />
                                    <Mui.Button
                                        variant="contained"
                                        onClick={handleAddVideo}
                                        disabled={addingVideo}
                                        startIcon={addingVideo ? <Mui.CircularProgress size={16} /> : <Icon.Add />}
                                        sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                                    >
                                        Thêm
                                    </Mui.Button>
                                </Mui.Stack>

                                {videoError && (
                                    <Mui.Typography variant="caption" color="error" mb={2} display="block">
                                        {videoError}
                                    </Mui.Typography>
                                )}

                                {/* Preview URL hợp lệ */}
                                {youtubeUrl && parseYoutubeUrl(youtubeUrl) && (
                                    <Mui.Box sx={{
                                        mb: 2, p: 1.5, borderRadius: 1,
                                        bgcolor: 'success.main', opacity: 0.9,
                                        display: 'flex', alignItems: 'center', gap: 1,
                                    }}>
                                        <Icon.CheckCircle sx={{ color: 'white', fontSize: 18 }} />
                                        <Mui.Typography variant="caption" color="white" fontWeight={600}>
                                            URL hợp lệ
                                        </Mui.Typography>
                                    </Mui.Box>
                                )}

                                <Mui.Divider sx={{ my: 2 }} />

                                {/* Danh sách video đã thêm */}
                                <Mui.Typography variant="subtitle2" fontWeight={800} mb={1.5}>
                                    Video hiện tại ({mediaVideos.length})
                                </Mui.Typography>

                                {loading ? (
                                    <Mui.Stack spacing={1}>
                                        {[...Array(2)].map((_, i) => (
                                            <Mui.Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 1.5 }} />
                                        ))}
                                    </Mui.Stack>
                                ) : mediaVideos.length === 0 ? (
                                    <Mui.Box sx={{
                                        py: 4, textAlign: 'center',
                                        border: '1px dashed', borderColor: 'divider', borderRadius: 2,
                                    }}>
                                        <Icon.YouTube sx={{ fontSize: 36, color: 'text.disabled' }} />
                                        <Mui.Typography variant="body2" color="text.secondary" mt={0.5}>
                                            Chưa có video nào — paste URL YouTube bên trên để thêm
                                        </Mui.Typography>
                                    </Mui.Box>
                                ) : (
                                    <Mui.Stack spacing={1.5}>
                                        {mediaVideos.map((vid) => {
                                            const thumbnail = getYoutubeThumbnail(vid.image_url)
                                            return (
                                                <Mui.Box key={vid.id} sx={{
                                                    display: 'flex', alignItems: 'center', gap: 2,
                                                    p: 1.5, borderRadius: 1.5,
                                                    border: '1px solid', borderColor: 'divider',
                                                }}>
                                                    {/* Thumbnail */}
                                                    <Mui.Box sx={{
                                                        width: 120, height: 68, borderRadius: 1,
                                                        overflow: 'hidden', flexShrink: 0,
                                                        bgcolor: 'background.default',
                                                        position: 'relative',
                                                    }}>
                                                        {thumbnail && (
                                                            <Mui.Box
                                                                component="img"
                                                                src={thumbnail}
                                                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                        <Mui.Box sx={{
                                                            position: 'absolute', inset: 0,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            <Icon.PlayCircle sx={{ color: 'white', fontSize: 28, filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))' }} />
                                                        </Mui.Box>
                                                    </Mui.Box>

                                                    {/* URL */}
                                                    <Mui.Typography variant="caption" color="text.secondary"
                                                        sx={{ flex: 1, wordBreak: 'break-all' }}>
                                                        {vid.image_url}
                                                    </Mui.Typography>

                                                    {/* Nút xóa */}
                                                    <Mui.IconButton
                                                        size="small"
                                                        onClick={() => deleteImage(vid.id)}
                                                        sx={{ color: 'error.main', flexShrink: 0 }}
                                                    >
                                                        <Icon.DeleteOutlined fontSize="small" />
                                                    </Mui.IconButton>
                                                </Mui.Box>
                                            )
                                        })}
                                    </Mui.Stack>
                                )}
                            </Mui.Box>
                        )}
                    </Mui.Box>
                </Mui.DialogContent>
            </Mui.Dialog>
        </>
    );
};

export default ProductImageManagerModal;