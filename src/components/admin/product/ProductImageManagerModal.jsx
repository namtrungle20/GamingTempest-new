import { useState } from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import ProductImageManager from './ProductImageManager';

const ProductImageManagerModal = ({ sanpham_id, productName }) => {
    const [open, setOpen] = useState(false);

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
                    <ProductImageManager sanpham_id={sanpham_id} />
                </Mui.DialogContent>
            </Mui.Dialog>
        </>
    );
};

export default ProductImageManagerModal;