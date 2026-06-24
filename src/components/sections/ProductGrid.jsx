import * as Mui from '@mui/material';
import ProductCard from '@/components/card/ProductCard';

const ProductGrid = ({ products }) => {
    return (
        <Mui.Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: 'repeat(2, minmax(140px, 1fr))', // Mobile giữ 2 cột
                sm: 'repeat(3, minmax(160px, 1fr))', // Máy tính bảng 3 cột
                md: 'repeat(3, minmax(180px, 1fr))', // Desktop trung bình + có sidebar lọc: 3 cột
                lg: 'repeat(4, minmax(200px, 1fr))', // 💡 Màn hình lớn 1440px: 4 cột là tỷ lệ vàng bề thế nhất
            },
            gap: 3, // Tăng gap lên 3 (24px) cho thoáng đãng, không bị ngột ngạt
        }}>
            {products.map(p => (
                <Mui.Box
                    key={p.id}
                    sx={{
                        '& .MuiCard-root': {
                            minWidth: '0 !important',
                            maxWidth: '100% !important',
                            width: '100% !important',
                            mr: '0 !important',
                            height: '100%',
                        }
                    }}
                >
                    {/* 💡 CHỐT HẠ 1: Bắt buộc phải truyền flexible={true} để card tự bung lụa theo Grid */}
                    <ProductCard product={p} flexible={true} />
                </Mui.Box>
            ))}
        </Mui.Box>
    );
};

export default ProductGrid;