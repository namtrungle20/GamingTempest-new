import { useState } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'
import { useCart } from '@/hook/provider/CartProvider'


const InfoRow = ({ icon, label, value }) => (
    <Mui.Box display="flex" alignItems="center" gap={1.5}>
        <Mui.Box sx={{
            color: 'primary.main', width: 32, height: 32,
            borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            bgcolor: theme => theme.palette.mode === 'dark'
                ? 'rgba(255,137,6,0.12)' : 'rgba(255,137,6,0.08)',
        }}>
            {icon}
        </Mui.Box>
        <Mui.Typography variant="body2" color="text.secondary">
            {label}:{' '}
            <Mui.Box component="span" fontWeight={700} color="text.primary">{value}</Mui.Box>
        </Mui.Typography>
    </Mui.Box>
)

const ProductInfoPanel = ({ product }) => {
    const [quantity, setQuantity] = useState(1)
    const { addToCart, setIsCartOpen } = useCart()

    const handleAddToCart = async () => {
        const res = await addToCart(product, quantity)
        if (res && res.success === false) {
            alert(res.message)
        } else {
            setIsCartOpen(true)
        }
    }

    return (
        <Mui.Paper elevation={0} sx={{
            p: 3, borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
            border: '1px solid', borderColor: 'divider',
            position: { md: 'sticky' }, top: { md: 96 },
        }}>
            <Mui.Stack spacing={2}>

                {/* Brand chip */}
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

                {/* Name */}
                <Mui.Typography variant="h5" fontWeight={900} lineHeight={1.3}>
                    {product.name}
                </Mui.Typography>

                {/* Price */}
                <Mui.Typography variant="h4" fontWeight={900} color="primary.main">
                    {product.price}
                </Mui.Typography>

                {/* Stock */}
                <Mui.Chip
                    icon={product.inStock
                        ? <Icon.CheckCircle sx={{ fontSize: '15px !important' }} />
                        : <Icon.Block sx={{ fontSize: '15px !important' }} />
                    }
                    label={product.inStock ? `Còn ${product.soluong} sản phẩm` : 'Hết hàng'}
                    color={product.stockStatus}
                    size="small" variant="outlined"
                    sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
                />

                <Mui.Divider />

                {/* Info rows */}
                <Mui.Stack spacing={1.25}>
                    <InfoRow icon={<Icon.Category sx={{ fontSize: 17 }} />} label="Loại" value={product.loai || '—'} />
                    <InfoRow icon={<Icon.Storefront sx={{ fontSize: 17 }} />} label="Thương hiệu" value={product.thuonghieu || '—'} />
                    <InfoRow icon={<Icon.LocalShipping sx={{ fontSize: 17 }} />} label="Vận chuyển" value="Miễn phí" />
                </Mui.Stack>

                <Mui.Divider />

                {/* Quantity */}
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
                        <Mui.Typography sx={{
                            px: 2.5, fontWeight: 800, fontSize: '0.95rem',
                            userSelect: 'none', minWidth: 36, textAlign: 'center',
                        }}>
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

                {/* CTA */}
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

            </Mui.Stack>
        </Mui.Paper>
    )
}

export default ProductInfoPanel