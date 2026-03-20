import { useState, useEffect, useCallback } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'

const MainBanner = ({ payload }) => {
    const images = Array.isArray(payload?.mainBanner)
        ? payload.mainBanner
        : [payload?.mainBanner]

    const [activeIndex, setActiveIndex] = useState(0)

    const handleNext = useCallback(() =>
        setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
    , [images.length])

    const handlePrev = useCallback(() =>
        setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
    , [images.length])

    // ✅ reset index khi images thay đổi
    useEffect(() => {
        setActiveIndex(0)
    }, [images.length])

    useEffect(() => {
        const timer = setInterval(handleNext, 5000)
        return () => clearInterval(timer)
    }, [handleNext])

    return (
        <Mui.Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <Mui.Card
                elevation={0}
                sx={{
                    position: 'relative',
                    borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
                    height: { xs: 250, md: 500 },
                    bgcolor: 'background.paper',
                }}
            >
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
                            transition: 'opacity 0.8s ease-in-out',
                        }}
                    />
                ))}

                {/* Nút Trái */}
                <Mui.IconButton
                    onClick={handlePrev}
                    sx={{
                        position: 'absolute', left: 10, top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0,0,0,0.3)', color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                    }}
                >
                    <Icon.ArrowBackIosNew />
                </Mui.IconButton>

                {/* Nút Phải */}
                <Mui.IconButton
                    onClick={handleNext}
                    sx={{
                        position: 'absolute', right: 10, top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(0,0,0,0.3)', color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
                    }}
                >
                    <Icon.ArrowForwardIos />
                </Mui.IconButton>

                {/* Dots */}
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
                                transition: 'all 0.3s ease', // ✅ fix typo: 3s → 0.3s
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </Mui.Stack>
            </Mui.Card>
        </Mui.Box>
    )
}

export default MainBanner