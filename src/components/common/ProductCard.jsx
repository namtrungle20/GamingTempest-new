import * as Mui from '@mui/material';
import React from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductCard = ({ product }) => (
    <Mui.Card
        elevation={0}
        sx={{
            minWidth: { xs: 180, md: 220 },
            maxWidth: { xs: 180, md: 220 },
            borderRadius: '8px',
            border: '1px solid #2d2d2d', // Viền tối hơn để hợp nền đen
            bgcolor: '#16161a', // Màu nền card nhẹ hơn nền trang web một chút
            mr: 2,
            userSelect: 'none',
            scrollSnapAlign: 'start',
            transition: 'all 0.3s ease',
            '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(255, 137, 6, 0.2)' // Đổ bóng màu cam nhẹ
            }
        }}
    >
        <Mui.Box sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4/3',
            bgcolor: '#fff',
            borderRadius: '4px 4px 0 0',
            p: 1
        }}>
            <Mui.Box
                component="img"
                src={product.image || 'https://via.placeholder.com/300x225?text=No+Image'}
                sx={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
            />
        </Mui.Box>

        <Mui.CardContent sx={{ p: 2 }}>
            <Mui.Typography sx={{
                fontSize: '0.85rem', fontWeight: 600, height: '2.8em',
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                mb: 1.5, color: '#fffffe' // Màu text trắng sáng
            }}>
                {product.name}
            </Mui.Typography>

            <Mui.Typography sx={{ color: 'primary.main', fontWeight: 800, fontSize: '1.15rem' }}>
                {product.price?.toLocaleString()}đ
            </Mui.Typography>

            <Mui.Button
                fullWidth
                variant="contained"
                size="small"
                disableElevation
                sx={{
                    mt: 2,
                    borderRadius: '4px',
                    textTransform: 'uppercase', // Chữ in hoa cho chất gaming
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    py: 1,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: '#e57a05' }
                }}
            >
                Mua ngay
            </Mui.Button>
        </Mui.CardContent>
    </Mui.Card>
);

export default ProductCard;
