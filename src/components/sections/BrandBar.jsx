import { useState, useEffect, useCallback } from 'react'
import * as Mui from '@mui/material'
import { useNavigate, useSearchParams } from 'react-router-dom'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

const BrandBar = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [brands, setBrands] = useState([])

    const activeBrandId = searchParams.get('thuonghieu') || ''

    const fetchBrands = useCallback(async () => {
        try {
            const res = await apiConfig.get(API.BRANDS.LIST)
            setBrands(res.data?.data || [])
        } catch { }
    }, [])

    useEffect(() => { fetchBrands() }, [fetchBrands])

    if (!brands.length) return null

    const handleClick = (brandId) => {
        // Toggle: nhấn lại brand đang active thì bỏ lọc
        if (String(activeBrandId) === String(brandId)) {
            navigate('/products')
        } else {
            navigate(`/products?thuonghieu=${brandId}`)
        }
    }

    return (
        <Mui.Box sx={{ py: 3 }}>
            <Mui.Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Mui.Box sx={{ width: 3, height: 18, bgcolor: 'primary.main', borderRadius: 1 }} />
                <Mui.Typography variant="subtitle2" fontWeight={700}
                    sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Thương hiệu
                </Mui.Typography>
            </Mui.Stack>

            <Mui.Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {brands.map((brand) => {
                    const isActive = String(activeBrandId) === String(brand.thuonghieu_id)
                    return (
                        <Mui.Paper
                            key={brand.thuonghieu_id}
                            variant="outlined"
                            onClick={() => handleClick(brand.thuonghieu_id)}
                            sx={{
                                width: 110, height: 64,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                // ✅ highlight brand đang active
                                borderColor: isActive ? 'primary.main' : 'divider',
                                boxShadow: isActive ? '0 4px 16px rgba(255,137,6,0.2)' : 'none',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 16px rgba(255,137,6,0.15)',
                                }
                            }}
                        >
                            {brand.image ? (
                                <Mui.Box
                                    component="img"
                                    src={brand.image}
                                    alt={brand.name}
                                    sx={{
                                        maxWidth: '80%',
                                        maxHeight: '70%',
                                        objectFit: 'contain',
                                        // ✅ bỏ grayscale nếu đang active
                                        filter: isActive ? 'none' : 'grayscale(1)',
                                        transition: 'filter 0.2s',
                                        '&:hover': { filter: 'none' },
                                    }}
                                />
                            ) : (
                                <Mui.Typography
                                    variant="body2"
                                    fontWeight={800}
                                    color={isActive ? 'primary.main' : 'text.secondary'}
                                    sx={{ userSelect: 'none' }}
                                >
                                    {brand.name}
                                </Mui.Typography>
                            )}
                        </Mui.Paper>
                    )
                })}
            </Mui.Stack>
        </Mui.Box>
    )
}

export default BrandBar