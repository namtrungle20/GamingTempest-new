import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'
import { Link } from 'react-router-dom'
import { useProductCoverImage } from '@/hook/product/useProductCoverImage'

const CartItem = ({ item, onUpdateQty, onRemove }) => {
    const coverUrl = useProductCoverImage(item.id)

    const handleUpdateQty = (newQty) => {
        if (newQty < 1) return
        if (newQty > (item.soluong || 100)) {
            alert('Số lượng vượt quá tồn kho')
            return
        }
        onUpdateQty(item.id, newQty)
    }

    return (
        <Mui.Box sx={{ display: 'flex', gap: 2, mb: 2, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Mui.Box
                component={Link}
                to={`/products/${item.id}`}
                sx={{
                    width: 80, height: 80, flexShrink: 0,
                    bgcolor: 'background.default', borderRadius: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <Mui.Box
                    component="img"
                    src={coverUrl || 'https://via.placeholder.com/80?text=No+Image'}
                    alt={item.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }}
                />
            </Mui.Box>

            <Mui.Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Mui.Typography
                    component={Link}
                    to={`/products/${item.id}`}
                    variant="body2"
                    fontWeight={700}
                    sx={{
                        textDecoration: 'none', color: 'text.primary',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        '&:hover': { color: 'primary.main' }
                    }}
                >
                    {item.name}
                </Mui.Typography>

                <Mui.Typography variant="subtitle2" color="primary.main" fontWeight={700} sx={{ mt: 0.5 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </Mui.Typography>

                <Mui.Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Mui.Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Mui.IconButton size="small" onClick={() => handleUpdateQty(item.qty - 1)}>
                            <Icon.Remove sx={{ fontSize: 16 }} />
                        </Mui.IconButton>
                        <Mui.Typography variant="body2" sx={{ width: 24, textAlign: 'center', fontWeight: 600 }}>
                            {item.qty}
                        </Mui.Typography>
                        <Mui.IconButton size="small" onClick={() => handleUpdateQty(item.qty + 1)}>
                            <Icon.Add sx={{ fontSize: 16 }} />
                        </Mui.IconButton>
                    </Mui.Box>

                    <Mui.IconButton size="small" color="error" onClick={() => onRemove(item.id)}>
                        <Icon.DeleteOutline sx={{ fontSize: 20 }} />
                    </Mui.IconButton>
                </Mui.Box>
            </Mui.Box>
        </Mui.Box>
    )
}

export default CartItem
