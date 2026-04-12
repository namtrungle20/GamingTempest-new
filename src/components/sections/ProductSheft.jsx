import React, { useRef, useState } from 'react';
import * as Mui from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Icon mũi tên nhỏ
import ProductCard from '@/components/common/ProductCard';


const ProductShelf = ({ payload, hideViewAll = false }) => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <Mui.Box sx={{ mb: 8 }}>
      {/* Tiêu đề + Nút xem tất cả */}
      <Mui.Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Mui.Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2
          }}
        >
          {payload.title}
        </Mui.Typography>

        {!hideViewAll && <Mui.Button
          variant="text"
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: '0.75rem !important' }} />}
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
          }}
          onClick={() => {
            // Link điều hướng ở đây, ví dụ: window.location.href = payload.link
            console.log("Redirect to:", payload.link || "/products");
          }}
        >
          Xem tất cả
        </Mui.Button>
        }
      </Mui.Stack>

      {/* Danh sách cuộn ngang bằng chuột */}
      <Mui.Box
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollSnapType: isDragging ? 'none' : 'x mandatory',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          py: 1
        }}
      >
        {payload.items?.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </Mui.Box>
    </Mui.Box>
  );
};


export default ProductShelf;