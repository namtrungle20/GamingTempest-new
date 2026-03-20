import * as Mui from '@mui/material'
import { UI_SETTING } from '@/theme/uiSetting'
import MainBanner from '@/components/sections/MainBanner'
import ProductShelf from '@/components/sections/ProductSheft'

const COMPONENT_MAP = {
    MAIN_BANNER: MainBanner,
    PRODUCT_SHELF: ProductShelf,
}

const PageBuilder = ({ pageConfig }) => {
    if (!pageConfig) return null

    return (
        <>
            {pageConfig.map((block, index) => {
                const Component = COMPONENT_MAP[block.type]
                if (!Component) return null

                // Navbar tràn 100% màn hình — không bọc Container
                if (block.type === 'NAVBAR') {
                    return <Component key={index} data={block.payload} />
                }

                return (
                    <Mui.Container
                        key={index}
                        maxWidth={UI_SETTING.LAYOUT.CONTAINER_MAX_WIDTH}
                        sx={{
                            px: UI_SETTING.LAYOUT.PAGE_PADDING_X,
                            mt: UI_SETTING.LAYOUT.SECTION_SPACING,
                        }}
                    >
                        <Component payload={block.payload} />
                    </Mui.Container>
                )
            })}
        </>
    )
}

export default PageBuilder