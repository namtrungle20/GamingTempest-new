import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import { Link } from 'react-router-dom'
import useProductList from '@/hook/useProductList'
import { UI_SETTING } from '@/theme/uiSetting'

const SORT_OPTIONS = [
    { label: 'Mới nhất', sort_by: 'createdAt', sort_order: 'DESC' },
    { label: 'Cũ nhất', sort_by: 'createdAt', sort_order: 'ASC' },
    { label: 'Giá tăng dần', sort_by: 'gia', sort_order: 'ASC' },
    { label: 'Giá giảm dần', sort_by: 'gia', sort_order: 'DESC' },
    { label: 'Tên A-Z', sort_by: 'name', sort_order: 'ASC' },
]

// ── ProductCard ───────────────────────────────────────────────────────────
const ProductCard = ({ product }) => (
    <Mui.Card
        elevation={0}
        component={Link}
        to={`/products/${product.id}`}
        sx={{
            border: '1px solid', borderColor: 'divider',
            borderRadius: 2, textDecoration: 'none',
            transition: '0.2s',
            '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(255,137,6,0.15)'
            }
        }}
    >
        <Mui.Box sx={{ position: 'relative', aspectRatio: '4/3', bgcolor: 'background.default', borderRadius: '8px 8px 0 0', overflow: 'hidden' }}>
            <Mui.Box
                component="img"
                src={product.imageUrl || 'https://placehold.co/300x225?text=No+Image'}
                onError={(e) => { e.target.src = 'https://placehold.co/300x225?text=No+Image' }}
                sx={{ width: '100%', height: '100%', objectFit: 'contain', p: 1 }}
            />
            {!product.inStock && (
                <Mui.Chip
                    label="Hết hàng" size="small" color="error"
                    sx={{ position: 'absolute', top: 8, right: 8, fontWeight: 700, fontSize: '0.7rem' }}
                />
            )}
        </Mui.Box>
        <Mui.CardContent sx={{ p: 2 }}>
            <Mui.Typography variant="caption" color="text.secondary" fontWeight={600}>
                {product.thuonghieu || product.loai}
            </Mui.Typography>
            <Mui.Typography
                variant="body2" fontWeight={700} color="text.primary"
                sx={{ mt: 0.5, mb: 1, height: '2.8em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            >
                {product.name}
            </Mui.Typography>
            <Mui.Typography variant="subtitle1" fontWeight={900} color="primary.main">
                {product.price}
            </Mui.Typography>
        </Mui.CardContent>
    </Mui.Card>
)

// ── FilterPanel ───────────────────────────────────────────────────────────
const FilterPanel = ({ filters, brands, categories, updateFilter, resetFilters }) => (
    <Mui.Stack spacing={3}>
        <Mui.Box display="flex" justifyContent="space-between" alignItems="center">
            <Mui.Typography variant="subtitle1" fontWeight={900}>Bộ lọc</Mui.Typography>
            <Mui.Button size="small" onClick={resetFilters} sx={{ fontWeight: 700, color: 'text.secondary' }}>
                Xoá tất cả
            </Mui.Button>
        </Mui.Box>

        {/* Loại sản phẩm */}
        <Mui.Box>
            <Mui.Typography variant="body2" fontWeight={700} mb={1}>Loại sản phẩm</Mui.Typography>
            <Mui.Stack spacing={0.5}>
                <Mui.MenuItem
                    selected={filters.loai_id === ''}
                    onClick={() => updateFilter('loai_id', '')}
                    sx={{ borderRadius: 1, fontSize: '0.875rem', px: 1 }}
                >
                    Tất cả
                </Mui.MenuItem>
                {categories.map(c => (
                    <Mui.MenuItem
                        key={c.loai_id}
                        selected={filters.loai_id === String(c.loai_id)}
                        onClick={() => updateFilter('loai_id', String(c.loai_id))}
                        sx={{ borderRadius: 1, fontSize: '0.875rem', px: 1 }}
                    >
                        {c.name}
                    </Mui.MenuItem>
                ))}
            </Mui.Stack>
        </Mui.Box>

        <Mui.Divider />

        {/* Thương hiệu */}
        <Mui.Box>
            <Mui.Typography variant="body2" fontWeight={700} mb={1}>Thương hiệu</Mui.Typography>
            <Mui.Stack spacing={0.5}>
                <Mui.MenuItem
                    selected={filters.thuonghieu_id === ''}
                    onClick={() => updateFilter('thuonghieu_id', '')}
                    sx={{ borderRadius: 1, fontSize: '0.875rem', px: 1 }}
                >
                    Tất cả
                </Mui.MenuItem>
                {brands.map(b => (
                    <Mui.MenuItem
                        key={b.thuonghieu_id}
                        selected={filters.thuonghieu_id === String(b.thuonghieu_id)}
                        onClick={() => updateFilter('thuonghieu_id', String(b.thuonghieu_id))}
                        sx={{ borderRadius: 1, fontSize: '0.875rem', px: 1 }}
                    >
                        {b.name}
                    </Mui.MenuItem>
                ))}
            </Mui.Stack>
        </Mui.Box>

        <Mui.Divider />

        {/* Giá */}
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

// ── ProductListPage ───────────────────────────────────────────────────────
const ProductListPage = () => {
    const {
        products, brands, categories,
        loading, total, page, filters,
        setPage, updateFilter, resetFilters,
    } = useProductList()

    const pageSize = 10
    const totalPages = Math.ceil(total / pageSize)

    const currentSort = SORT_OPTIONS.find(
        o => o.sort_by === filters.sort_by && o.sort_order === filters.sort_order
    ) || SORT_OPTIONS[0]

    return (
        <Mui.Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Mui.Container maxWidth={UI_SETTING.LAYOUT.CONTAINER_MAX_WIDTH} sx={{ py: 4 }}>

                {/* Header */}
                <Mui.Box mb={3}>
                    <Mui.Typography variant="h5" fontWeight={900} color="text.primary">
                        Sản phẩm
                    </Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary">
                        {total} sản phẩm
                    </Mui.Typography>
                </Mui.Box>

                {/* Search + Sort */}
                <Mui.Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Mui.Box display="flex" gap={2} flexWrap="wrap">
                        <Mui.TextField
                            size="small" placeholder="Tìm kiếm sản phẩm..."
                            value={filters.search}
                            onChange={(e) => updateFilter('search', e.target.value)}
                            sx={{ flex: 1, minWidth: 200 }}
                            InputProps={{ startAdornment: <Mui.InputAdornment position="start"><Icon.Search fontSize="small" /></Mui.InputAdornment> }}
                        />
                        <Mui.TextField
                            select size="small" label="Sắp xếp"
                            value={`${filters.sort_by}_${filters.sort_order}`}
                            onChange={(e) => {
                                const opt = SORT_OPTIONS.find(o => `${o.sort_by}_${o.sort_order}` === e.target.value)
                                if (opt) { updateFilter('sort_by', opt.sort_by); updateFilter('sort_order', opt.sort_order) }
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

                <Mui.Box display="flex" gap={3} alignItems="flex-start">
                    {/* Filter sidebar */}
                    <Mui.Paper
                        elevation={0}
                        sx={{
                            width: 220, flexShrink: 0,
                            border: '1px solid', borderColor: 'divider',
                            borderRadius: 2, p: 2,
                            display: { xs: 'none', md: 'block' }
                        }}
                    >
                        <FilterPanel
                            filters={filters}
                            brands={brands}
                            categories={categories}
                            updateFilter={updateFilter}
                            resetFilters={resetFilters}
                        />
                    </Mui.Paper>

                    {/* Product grid */}
                    <Mui.Box flex={1}>
                        {loading ? (
                            <Mui.Grid container spacing={2}>
                                {[...Array(10)].map((_, i) => (
                                    <Mui.Grid item xs={6} sm={4} lg={3} key={i}>
                                        <Mui.Skeleton variant="rounded" height={280} />
                                    </Mui.Grid>
                                ))}
                            </Mui.Grid>
                        ) : products.length === 0 ? (
                            <Mui.Box textAlign="center" py={10}>
                                <Icon.SearchOff sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                <Mui.Typography color="text.secondary">Không tìm thấy sản phẩm nào</Mui.Typography>
                                <Mui.Button onClick={resetFilters} sx={{ mt: 2, fontWeight: 700 }}>
                                    Xoá bộ lọc
                                </Mui.Button>
                            </Mui.Box>
                        ) : (
                            <Mui.Grid container spacing={2}>
                                {products.map(p => (
                                    <Mui.Grid item xs={6} sm={4} lg={3} key={p.id}>
                                        <ProductCard product={p} />
                                    </Mui.Grid>
                                ))}
                            </Mui.Grid>
                        )}

                        {totalPages > 1 && (
                            <Mui.Box display="flex" justifyContent="center" mt={4}>
                                <Mui.Pagination
                                    count={totalPages}
                                    page={page}
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