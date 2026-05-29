import * as Mui from '@mui/material';
import ProductCard from '@/components/card/ProductCard';

const ProductGrid = ({ products }) => {
    return (
        <Mui.Box sx={{
            display: 'grid',
            gridTemplateColumns: {
                xs: 'repeat(2, minmax(150px, 1fr))',
                sm: 'repeat(3, minmax(160px, 1fr))',
                md: 'repeat(6, minmax(180px, 1fr))',
            },
            gap: 2,
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
                    <ProductCard product={p} />
                </Mui.Box>
            ))}
        </Mui.Box>
    );
};

export default ProductGrid;