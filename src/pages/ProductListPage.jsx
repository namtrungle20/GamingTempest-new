import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import useProductList from '@/hook/product/useProductList'
import { UI_SETTING } from '@/theme/uiSetting'
import ProductGrid from '@/components/sections/ProductGrid';

const SORT_OPTIONS = [
    { label: 'Mới nhất', sort_by: 'createdAt', sort_order: 'DESC' },
    { label: 'Cũ nhất', sort_by: 'createdAt', sort_order: 'ASC' },
    { label: 'Giá tăng dần', sort_by: 'gia', sort_order: 'ASC' },
    { label: 'Giá giảm dần', sort_by: 'gia', sort_order: 'DESC' },
    { label: 'Tên A-Z', sort_by: 'name', sort_order: 'ASC' },
]

const FilterPanel = ({ filters, brands, categories, updateFilter, resetFilters }) => (
    <Mui.Stack spacing={3}>
        <Mui.Box display="flex" justifyContent="space-between" alignItems="center">
            <Mui.Typography variant="subtitle1" fontWeight={900}>Bộ lọc</Mui.Typography>
            <Mui.Button size="small" onClick={resetFilters} sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Xoá tất cả
            </Mui.Button>
        </Mui.Box>

        <Mui.Box>
            <Mui.Typography variant="body2" fontWeight={700} mb={1}>Loại sản phẩm</Mui.Typography>
            <Mui.Stack spacing={0.5}>
                <Mui.MenuItem
                    selected={filters.loai_id === ''}
                    onClick={() => updateFilter('loai_id', '')}
                    sx={{ borderRadius: 1, fontSize: '0.875rem', px: 1 }}
                >Tất cả</Mui.MenuItem>
                {categories.map(c => (
                    <Mui.MenuItem
                        key={c.loai_id}
                        selected={filters.loai_id === String(c.loai_id)}
                        onClick={() => updateFilter('loai_id', String(c.loai_id))}
                        sx={{ borderRadius: 1, fontSize: '0.875rem', px: 1 }}
                    >{c.name}</Mui.MenuItem>
                ))}
            </Mui.Stack>
        </Mui.Box>

        <Mui.Divider />

        <Mui.Box>
            <Mui.Typography variant="body2" fontWeight={700} mb={1}>Thương hiệu</Mui.Typography>
            <Mui.Stack spacing={0.5}>
                <Mui.MenuItem
                    selected={filters.thuonghieu_id === ''}
                    onClick={() => updateFilter('thuonghieu_id', '')}
                    sx={{ borderRadius: 1, fontSize: '0.875rem', px: 1 }}
                >Tất cả</Mui.MenuItem>
                {brands.map(b => (
                    <Mui.MenuItem
                        key={b.thuonghieu_id}
                        selected={filters.thuonghieu_id === String(b.thuonghieu_id)}
                        onClick={() => updateFilter('thuonghieu_id', String(b.thuonghieu_id))}
                        sx={{ borderRadius: 1, fontSize: '0.875rem', px: 1 }}
                    >{b.name}</Mui.MenuItem>
                ))}
            </Mui.Stack>
        </Mui.Box>

        <Mui.Divider />

        <Mui.Box>
            <Mui.Typography variant="body2" fontWeight={700} mb={1.5}>Khoảng giá</Mui.Typography>
            <Mui.Stack spacing={1.5}>
                <Mui.TextField
                    size="small" label="Giá từ" type="number"
                    value={filters.gia_min}
                    onChange={(e) => updateFilter('gia_min', e.target.value)}
                    InputProps={{ endAdornment: <Mui.InputAdornment position="end">₫</Mui.InputAdornment> }}
                />
                <Mui.TextField
                    size="small" label="Giá đến" type="number"
                    value={filters.gia_max}
                    onChange={(e) => updateFilter('gia_max', e.target.value)}
                    InputProps={{ endAdornment: <Mui.InputAdornment position="end">₫</Mui.InputAdornment> }}
                />
            </Mui.Stack>
        </Mui.Box>
    </Mui.Stack>
)

const ProductListPage = () => {
    const {
        products, brands, categories,
        loading, total, page, filters,
        setPage, updateFilter, resetFilters,
    } = useProductList()

    const pageSize = 30
    const totalPages = Math.ceil(total / pageSize)

    return (
        <Mui.Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* 💡 CHỐT HẠ: Tắt maxWidth cũ và ép layout giãn rộng ra 1440px theo chuẩn rạp phim */}
            <Mui.Container maxWidth={false} sx={{ maxWidth: '1440px !important', py: 4 }}>

                <Mui.Box mb={3}>
                    <Mui.Typography variant="h5" fontWeight={900} color="text.primary">Sản phẩm</Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary">{total} sản phẩm</Mui.Typography>
                </Mui.Box>

                <Mui.Paper elevation={0} sx={{ p: 2, mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Mui.Box display="flex" gap={2} flexWrap="wrap">
                        <Mui.TextField
                            size="small" placeholder="Tìm kiếm sản phẩm..."
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            sx={{ flex: 1, minWidth: 200 }}
                            InputProps={{
                                startAdornment: (
                                    <Mui.InputAdornment position="start">
                                        <Icon.Search fontSize="small" />
                                    </Mui.InputAdornment>
                                )
                            }}
                        />
                        <Mui.TextField
                            select size="small" label="Sắp xếp"
                            value={`${filters.sort_by}_${filters.sort_order}`}
                            onChange={(e) => {
                                const opt = SORT_OPTIONS.find(o => `${o.sort_by}_${o.sort_order}` === e.target.value)
                                if (opt) {
                                    updateFilter('sort_by', opt.sort_by)
                                    updateFilter('sort_order', opt.sort_order)
                                }
                            }}
                            sx={{ minWidth: 160 }}
                        >
                            {SORT_OPTIONS.map(o => (
                                <Mui.MenuItem key={`${o.sort_by}_${o.sort_order}`} value={`${o.sort_by}_${o.sort_order}`}>
                                    {o.label}
                                </Mui.MenuItem>
                            ))}
                        </Mui.TextField>
                    </Mui.Box>
                </Mui.Paper>

                {/* Tăng khoảng gap từ 3 lên 4 cho thoáng đạt cấu trúc tổng thể */}
                <Mui.Box display="flex" gap={4} alignItems="flex-start">

                    {/* Bộ lọc bên trái - tăng width từ 220 lên 260 cho bớt thon, chữ dễ đọc hơn */}
                    <Mui.Paper
                        elevation={0}
                        sx={{
                            width: 260, flexShrink: 0,
                            border: '1px solid', borderColor: 'divider',
                            borderRadius: 2, p: 2.5,
                            display: { xs: 'none', md: 'block' }
                        }}
                    >
                        <FilterPanel
                            filters={filters} brands={brands} categories={categories}
                            updateFilter={updateFilter} resetFilters={resetFilters}
                        />
                    </Mui.Paper>

                    {/* Danh sách sản phẩm bên phải */}
                    <Mui.Box flex={1} minWidth={0}>
                        {loading ? (
                            <Mui.Grid container spacing={3}> {/* Tăng khoảng cách card lên 3 */}
                                {[...Array(12)].map((_, i) => (
                                    // 💡 Đổi từ md={2} (6 card/hàng rất bé và thon) sang md={4} hoặc md={3} (3 hoặc 4 card/hàng) 
                                    // Giúp card to hơn, vuông vắn hình chữ nhật tỷ lệ cân đối
                                    <Mui.Grid item xs={6} sm={4} md={4} lg={3} key={i}>
                                        <Mui.Skeleton variant="rounded" sx={{ width: '100%', aspectRatio: '3/4', borderRadius: 2 }} />
                                    </Mui.Grid>
                                ))}
                            </Mui.Grid>
                        ) : products.length === 0 ? (
                            <Mui.Box textAlign="center" py={10}>
                                <Icon.SearchOff sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                <Mui.Typography color="text.secondary">Không tìm thấy sản phẩm nào</Mui.Typography>
                                <Mui.Button onClick={resetFilters} sx={{ mt: 2, fontWeight: 700 }}>Xoá bộ lọc</Mui.Button>
                            </Mui.Box>
                        ) : (
                            <ProductGrid products={products} />
                        )}

                        {totalPages > 1 && (
                            <Mui.Box display="flex" justifyContent="center" mt={5}>
                                <Mui.Pagination
                                    count={totalPages} page={page}
                                    onChange={(_, val) => setPage(val)}
                                    color="primary"
                                />
                            </Mui.Box>
                        )}
                    </Mui.Box>

                </Mui.Box>
            </Mui.Container>
        </Mui.Box>
    )
}

export default ProductListPage