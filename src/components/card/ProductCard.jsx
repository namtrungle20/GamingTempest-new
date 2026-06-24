import { useProductCoverImage } from '@/hook/product/useProductCoverImage';
import { useCart } from '@/hook/provider/CartProvider';
import * as Mui from '@mui/material';
import { UI_SETTING } from '@/theme/uiSetting';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, flexible = false }) => {
    const navigate = useNavigate();
    const coverUrl = useProductCoverImage(product.id)
    const { addToCart, setIsCartOpen } = useCart();

    return (
        <Mui.Card
            elevation={0}
            onClick={() => navigate(`/products/${product.id}`)}
            sx={{
                ...(flexible
                    ? { width: '100%' }
                    : {
                        minWidth: { xs: 200, md: 220 },
                        maxWidth: { xs: 200, md: 220 },
                        mr: 2,
                        scrollSnapAlign: 'start',
                    }
                ),
                borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                userSelect: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(255, 137, 6, 0.15)',
                }
            }}
        >
            {/* Ảnh sản phẩm */}
            <Mui.Box sx={{
                width: '100%',
                aspectRatio: '1/1', // 💡 CHỐT HẠ 2: Đổi từ 4/3 sang 1/1 giúp khối card vuông vắn, khỏe khoắn, không bị thon dài
                bgcolor: '#fff',
                borderRadius: `${UI_SETTING.SHAPE.CARD_RADIUS * 4}px ${UI_SETTING.SHAPE.CARD_RADIUS * 4}px 0 0`,
                p: 2, // Tăng padding một chút để ảnh sản phẩm co gọn đẹp trong khung
                overflow: 'hidden',
            }}>
                <Mui.Box
                    component="img"
                    src={coverUrl || '/placeholder.png'}
                    alt={product.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
                />
            </Mui.Box>

            <Mui.CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {/* Tên */}
                <Mui.Typography sx={{
                    fontSize: '0.88rem', // Tăng nhẹ font chữ cho tương xứng layout rộng
                    fontWeight: 600,
                    height: '2.8em',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 1,
                    color: 'text.primary',
                }}>
                    {product.name}
                </Mui.Typography>

                {/* Giá */}
                <Mui.Typography sx={{
                    color: 'primary.main',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    mb: 0.5,
                }}>
                    {typeof product.price === 'number'
                        ? product.price.toLocaleString('vi-VN')
                        : Number(product.gia).toLocaleString('vi-VN')
                    }đ
                </Mui.Typography>

                {/* Nút mua */}
                <Mui.Button
                    fullWidth
                    variant="contained"
                    size="small"
                    disableElevation
                    onClick={async (e) => {
                        e.stopPropagation();
                        const res = await addToCart(product, 1);
                        if (res?.success === false) {
                            alert(res.message);
                        } else {
                            setIsCartOpen(true);
                        }
                    }}
                    sx={{
                        mt: 1.5,
                        borderRadius: UI_SETTING.SHAPE.BUTTON_RADIUS,
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        py: 1,
                    }}
                >
                    Mua ngay
                </Mui.Button>
            </Mui.CardContent>
        </Mui.Card>
    );
};

export default ProductCard;