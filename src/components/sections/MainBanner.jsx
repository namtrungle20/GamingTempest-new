import React, { useState, useEffect } from 'react';
import * as Mui from '@mui/material';
import { UI_SETTING } from '../../theme/uiSetting';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const MainBanner = ({ payload }) => {
  // Lấy mảng ảnh từ payload (Nếu bạn truyền vào mainBanner là một mảng)
  const images = Array.isArray(payload?.mainBanner) 
    ? payload.mainBanner 
    : [payload?.mainBanner];

  const [activeIndex, setActiveIndex] = useState(0);

  // Logic tự chuyển ảnh
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 giây đổi một lần

    return () => clearInterval(timer);
  }, [images.length]);

  const handleNext = () => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  return (
    <Mui.Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <Mui.Card
        elevation={0}
        sx={{
          position: 'relative',
          borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
          height: { xs: 250, md: 500 }, // Tăng chiều cao lên vì giờ nó chiếm 100% chiều ngang
          bgcolor: 'background.paper',
        }}
      >
        {/* Render ảnh với hiệu ứng mượt */}
        {images.map((img, index) => (
          <Mui.Box
            key={index}
            component="img"
            src={img}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: activeIndex === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out', // Hiệu ứng mờ dần (Fade)
            }}
          />
        ))}

        {/* Nút điều hướng Trái/Phải */}
        <Mui.IconButton
          onClick={handlePrev}
          sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.3)', color: 'white', '&:hover': {bgcolor: 'rgba(0,0,0,0.5)'} }}
        >
          <ArrowBackIosNewIcon />
        </Mui.IconButton>

        <Mui.IconButton
          onClick={handleNext}
          sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.3)', color: 'white', '&:hover': {bgcolor: 'rgba(0,0,0,0.5)'} }}
        >
          <ArrowForwardIosIcon />
        </Mui.IconButton>

        {/* Các dấu chấm (Dots) báo hiệu vị trí ảnh */}
        <Mui.Stack 
          direction="row" 
          spacing={1} 
          sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}
        >
          {images.map((_, index) => (
            <Mui.Box
              key={index}
              onClick={() => setActiveIndex(index)}
              sx={{
                width: activeIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                bgcolor: activeIndex === index ? 'primary.main' : 'rgba(255,255,255,0.5)',
                transition: 'all 3s ease',
                cursor: 'pointer'
              }}
            />
          ))}
        </Mui.Stack>
      </Mui.Card>
    </Mui.Box>
  );
};

export default MainBanner;