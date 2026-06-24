import * as Mui from '@mui/material'

const ProductDetailSkeleton = () => (
    <Mui.Grid container spacing={4}>

        <Mui.Grid item xs={12} md={7.2}>
            <Mui.Skeleton
                variant="rounded"
                sx={{
                    width: '100%',
                    aspectRatio: '16/9',
                    borderRadius: 3
                }}
            />
        </Mui.Grid>

        {/* Cột phải: Panel thông tin */}
        <Mui.Grid item xs={12} md={4.8}> {/* 4.8/12 tương đương đúng 40% còn lại */}
            <Mui.Stack spacing={2}>
                <Mui.Skeleton variant="rounded" width={80} height={24} />
                <Mui.Skeleton variant="text" width="90%" height={40} />
                <Mui.Skeleton variant="text" width="50%" height={44} />
                <Mui.Skeleton variant="rounded" width={120} height={28} />
                <Mui.Skeleton variant="rounded" width="100%" height={1} />
                {[1, 2, 3].map(i => (
                    <Mui.Skeleton key={i} variant="text" width={`${70 - i * 10}%`} height={20} />
                ))}
                <Mui.Skeleton variant="rounded" width="100%" height={50} sx={{ mt: 1 }} />
            </Mui.Stack>
        </Mui.Grid>
    </Mui.Grid>
)

export default ProductDetailSkeleton