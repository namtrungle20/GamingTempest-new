import * as Mui from '@mui/material'
const PageLoader = () => (
    <Mui.Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Mui.CircularProgress color="primary" />
    </Mui.Box>
)

export default PageLoader;