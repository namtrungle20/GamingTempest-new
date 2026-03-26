import { useState, useEffect, useCallback } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { UI_SETTING } from '@/theme/uiSetting'

const AUTO_SLIDE_INTERVAL = 4000

const ImageGallery = ({ images = [], productName = '' }) => {
    const [current, setCurrent] = useState(0)
    const [paused, setPaused] = useState(false)
    const [lightbox, setLightbox] = useState(false)
    const hasMultiple = images.length > 1

    const prev = useCallback(() => setCurrent(i => (i === 0 ? images.length - 1 : i - 1)), [images.length])
    const next = useCallback(() => setCurrent(i => (i === images.length - 1 ? 0 : i + 1)), [images.length])

    useEffect(() => {
        if (!hasMultiple || paused) return
        const timer = setInterval(next, AUTO_SLIDE_INTERVAL)
        return () => clearInterval(timer)
    }, [hasMultiple, paused, next])

    // Đóng lightbox bằng ESC
    useEffect(() => {
        if (!lightbox) return
        const handler = e => { if (e.key === 'Escape') setLightbox(false) }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [lightbox])

    const mainSrc = images[current] || 'https://placehold.co/800x800?text=No+Image'

    const NavButton = ({ side, action }) => (
        <Mui.IconButton
            onClick={e => { e.stopPropagation(); action() }}
            size="small"
            sx={{
                position: 'absolute', top: '50%',
                [side]: 10,
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.45)',
                color: '#fff', width: 36, height: 36,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                transition: 'background 0.2s',
                zIndex: 1,
            }}
        >
            {side === 'left' ? <Icon.ChevronLeft /> : <Icon.ChevronRight />}
        </Mui.IconButton>
    )

    return (
        <>
            <Mui.Box onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                {/* Main image */}
                <Mui.Box
                    onClick={() => setLightbox(true)}
                    sx={{
                        position: 'relative',
                        borderRadius: UI_SETTING.SHAPE.CARD_RADIUS,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        width: '100%',
                        height: { xs: 'auto', md: '500px' },
                        aspectRatio: { xs: '1/1', md: 'unset' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'zoom-in',
                        '&:hover .zoom-hint': { opacity: 1 },
                    }}>
                    <Mui.Box
                        component="img"
                        src={mainSrc}
                        onError={e => { e.target.src = 'https://placehold.co/800x800?text=No+Image' }}
                        alt={`${productName} - ${current + 1}`}
                        sx={{
                            width: '100%', height: '100%',
                            objectFit: 'contain',
                            imageRendering: 'crisp-edges',
                            transition: 'opacity 0.25s ease',
                        }}
                    />

                    {/* Zoom hint */}
                    <Mui.Box className="zoom-hint" sx={{
                        position: 'absolute', bottom: 12, right: 12,
                        bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 1.5,
                        px: 1.25, py: 0.5,
                        display: 'flex', alignItems: 'center', gap: 0.5,
                        opacity: 0, transition: 'opacity 0.2s',
                    }}>
                        <Icon.ZoomIn sx={{ fontSize: 15, color: '#fff' }} />
                        <Mui.Typography sx={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>
                            Phóng to
                        </Mui.Typography>
                    </Mui.Box>

                    {hasMultiple && (
                        <>
                            <NavButton side="left" action={prev} />
                            <NavButton side="right" action={next} />

                            {/* Dots */}
                            <Mui.Box sx={{
                                position: 'absolute', bottom: 10,
                                left: '50%', transform: 'translateX(-50%)',
                                display: 'flex', gap: 0.75,
                            }}>
                                {images.map((_, i) => (
                                    <Mui.Box
                                        key={i}
                                        onClick={e => { e.stopPropagation(); setCurrent(i) }}
                                        sx={{
                                            width: i === current ? 20 : 7, height: 7,
                                            borderRadius: 4,
                                            bgcolor: i === current ? 'primary.main' : 'rgba(255,255,255,0.45)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                        }}
                                    />
                                ))}
                            </Mui.Box>
                        </>
                    )}
                </Mui.Box>

                {/* Thumbnails */}
                {hasMultiple && (
                    <Mui.Box display="flex" gap={1} mt={1.5} sx={{ overflowX: 'auto', pb: 0.5 }}>
                        {images.map((img, i) => (
                            <Mui.Box
                                key={i} onClick={() => setCurrent(i)}
                                sx={{
                                    width: 64, height: 64, flexShrink: 0,
                                    borderRadius: 1.5,
                                    border: '2px solid',
                                    borderColor: i === current ? 'primary.main' : 'divider',
                                    overflow: 'hidden', cursor: 'pointer',
                                    opacity: i === current ? 1 : 0.55,
                                    transition: 'all 0.2s ease',
                                    '&:hover': { opacity: 1 },
                                }}
                            >
                                <Mui.Box
                                    component="img" src={img}
                                    alt={`Thumb ${i + 1}`}
                                    sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 0.5 }}
                                />
                            </Mui.Box>
                        ))}
                    </Mui.Box>
                )}
            </Mui.Box>

            {/* Lightbox */}
            <Mui.Modal
                open={lightbox}
                onClose={() => setLightbox(false)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Mui.Box
                    onClick={() => setLightbox(false)}
                    sx={{
                        position: 'relative',
                        width: '90vw', height: '90vh',
                        maxWidth: 1280,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        outline: 'none',
                    }}
                >
                    <Mui.Box
                        component="img"
                        src={mainSrc}
                        alt={productName}
                        onClick={e => e.stopPropagation()}
                        sx={{
                            maxWidth: '100%', maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: 2,
                            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
                        }}
                    />

                    {/* Close */}
                    <Mui.IconButton
                        onClick={() => setLightbox(false)}
                        sx={{
                            position: 'absolute', top: -16, right: -16,
                            bgcolor: 'rgba(0,0,0,0.6)', color: '#fff',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
                        }}
                    >
                        <Icon.Close />
                    </Mui.IconButton>

                    {/* Nav trong lightbox */}
                    {hasMultiple && (
                        <>
                            <Mui.IconButton
                                onClick={e => { e.stopPropagation(); prev() }}
                                sx={{
                                    position: 'absolute', left: -20, top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', width: 44, height: 44,
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
                                }}
                            >
                                <Icon.ChevronLeft />
                            </Mui.IconButton>
                            <Mui.IconButton
                                onClick={e => { e.stopPropagation(); next() }}
                                sx={{
                                    position: 'absolute', right: -20, top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(0,0,0,0.6)', color: '#fff', width: 44, height: 44,
                                    '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
                                }}
                            >
                                <Icon.ChevronRight />
                            </Mui.IconButton>
                        </>
                    )}

                    {/* Counter */}
                    {hasMultiple && (
                        <Mui.Typography sx={{
                            position: 'absolute', bottom: -32,
                            left: '50%', transform: 'translateX(-50%)',
                            color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 600,
                        }}>
                            {current + 1} / {images.length}
                        </Mui.Typography>
                    )}
                </Mui.Box>
            </Mui.Modal>
        </>
    )
}

export default ImageGallery