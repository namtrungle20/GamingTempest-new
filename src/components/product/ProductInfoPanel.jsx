import { useState } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import { UI_SETTING } from '@/theme/uiSetting';
import { useCart } from '@/hook/provider/CartProvider';

const InfoRow = ({ icon, label, value }) => (
    <Mui.Box display="flex" alignItems="center" gap={1.5}>
        <Mui.Box sx={{
            color: 'primary.main', width: 32, height: 32,
            borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,137,6,0.12)' : 'rgba(255,137,6,0.08)',
        }}>
            {icon}
        </Mui.Box>
        <Mui.Typography variant="body2" color="text.secondary">
            {label}: <Mui.Box component="span" fontWeight={700} color="text.primary">{value}</Mui.Box>
        </Mui.Typography>
    </Mui.Box>
);

const ProductInfoPanel = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, setIsCartOpen } = useCart();

    const handleAddToCart = async () => {
        const result = await addToCart(product, quantity);
        if (result && result.success === false) {
            alert(result.message || 'Không thể thêm vào giỏ hàng');
        } else {
            setIsCartOpen(true);
        }
    };

    return (
        <Mui.Paper elevation={0} sx={{
            p: { xs: 3, md: 4 },
            borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
            border: '1px solid',
            borderColor: 'divider',
            height: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Mui.Stack spacing={2.5} sx={{ flexGrow: 1 }}>
                {/* Chip thương hiệu */}
                {(product.thuonghieu || product.loai) && (
                    <Mui.Chip
                        label={product.thuonghieu || product.loai}
                        size="small"
                        sx={{
                            alignSelf: 'flex-start', fontWeight: 800,
                            fontSize: '0.68rem', letterSpacing: 0.8,
                            textTransform: 'uppercase',
                            bgcolor: 'primary.main', color: '#fff',
                            borderRadius: '6px', height: 24,
                        }}
                    />
                )}

                {/* Tên sản phẩm */}
                <Mui.Typography variant="h5" fontWeight={900} lineHeight={1.3}>
                    {product.name}
                </Mui.Typography>

                {/* Giá */}
                <Mui.Typography variant="h4" fontWeight={900} color="primary.main">
                    {product.price}
                </Mui.Typography>

                {/* Đánh giá + đã bán */}
                <Mui.Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                    <Mui.Box display="flex" alignItems="center" gap={0.5}>
                        <Mui.Rating value={4.5} precision={0.5} size="small" readOnly />
                        <Mui.Typography variant="caption" color="text.secondary">(12 đánh giá)</Mui.Typography>
                    </Mui.Box>
                    <Mui.Divider orientation="vertical" flexItem />
                    <Mui.Typography variant="caption" color="text.secondary">Đã bán 36</Mui.Typography>
                </Mui.Box>

                {/* Tình trạng kho */}
                <Mui.Chip
                    icon={product.inStock ? <Icon.CheckCircle sx={{ fontSize: '15px !important' }} /> : <Icon.Block sx={{ fontSize: '15px !important' }} />}
                    label={product.inStock ? `Còn ${product.soluong} sản phẩm` : 'Hết hàng'}
                    color={product.stockStatus}
                    size="small" variant="outlined"
                    sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                />

                <Mui.Divider />

                {/* Thông tin chi tiết */}
                <Mui.Stack spacing={1.5}>
                    <InfoRow icon={<Icon.Category sx={{ fontSize: 17 }} />} label="Loại" value={product.loai || '—'} />
                    <InfoRow icon={<Icon.Storefront sx={{ fontSize: 17 }} />} label="Thương hiệu" value={product.thuonghieu || '—'} />
                    <InfoRow icon={<Icon.LocalShipping sx={{ fontSize: 17 }} />} label="Vận chuyển" value="Miễn phí toàn quốc" />
                    <InfoRow icon={<Icon.Replay sx={{ fontSize: 17 }} />} label="Đổi trả" value="30 ngày miễn phí" />
                    <InfoRow icon={<Icon.Security sx={{ fontSize: 17 }} />} label="Bảo hành" value="12 tháng chính hãng" />
                </Mui.Stack>

                <Mui.Divider />

                {/* Số lượng */}
                <Mui.Box>
                    <Mui.Typography variant="caption" fontWeight={700} color="text.secondary"
                        sx={{ mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Số lượng
                    </Mui.Typography>
                    <Mui.Box display="flex" alignItems="center" sx={{
                        border: '1px solid', borderColor: 'divider',
                        borderRadius: 1.5, overflow: 'hidden', width: 'fit-content',
                    }}>
                        <Mui.IconButton
                            size="small"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            disabled={!product.inStock || quantity <= 1}
                            sx={{ borderRadius: 0, px: 1.5, py: 1 }}
                        >
                            <Icon.Remove fontSize="small" />
                        </Mui.IconButton>
                        <Mui.Typography sx={{ px: 2.5, fontWeight: 800, fontSize: '0.95rem', userSelect: 'none', minWidth: 36, textAlign: 'center' }}>
                            {quantity}
                        </Mui.Typography>
                        <Mui.IconButton
                            size="small"
                            onClick={() => setQuantity(q => Math.min(product.soluong, q + 1))}
                            disabled={!product.inStock || quantity >= product.soluong}
                            sx={{ borderRadius: 0, px: 1.5, py: 1 }}
                        >
                            <Icon.Add fontSize="small" />
                        </Mui.IconButton>
                    </Mui.Box>
                </Mui.Box>

                {/* Nút hành động */}
                <Mui.Stack spacing={1.5} sx={{ pt: 4 }}>
                    <Mui.Button
                        variant="contained" size="large" fullWidth
                        startIcon={<Icon.ShoppingCart />}
                        disabled={!product.inStock}
                        onClick={handleAddToCart}
                        sx={{
                            py: 1.6, fontWeight: 800,
                            borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS,
                            textTransform: 'none', fontSize: '0.95rem',
                            boxShadow: '0 4px 14px rgba(255,137,6,0.25)',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(255,137,6,0.35)',
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {product.inStock ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}
                    </Mui.Button>
                    <Mui.Button
                        variant="outlined" size="large" fullWidth
                        sx={{
                            py: 1.6, fontWeight: 700,
                            borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS,
                            textTransform: 'none',
                        }}
                    >
                        Mua ngay
                    </Mui.Button>
                </Mui.Stack>
            </Mui.Stack>
        </Mui.Paper>
    );
};

export default ProductInfoPanel;