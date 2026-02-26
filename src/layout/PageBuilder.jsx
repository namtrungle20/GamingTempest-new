import React from 'react';
import * as Mui from '@mui/material';
import { UI_SETTING } from '../theme/uiSetting';

// Import linh kiện
import Navbar from '../components/nav/Navbar';
import MainBanner from '../components/sections/MainBanner';
import ProductShelf from '../components/sections/ProductSheft';

const COMPONENT_MAP = {
  'NAVBAR': Navbar,
  'MAIN_BANNER': MainBanner,
  'PRODUCT_SHELF': ProductShelf,
};

const PageBuilder = ({ pageConfig }) => {
  if (!pageConfig) return null;

  return (
    <>
      {pageConfig.map((block, index) => {
        const Component = COMPONENT_MAP[block.type];
        if (!Component) return null;

        // Nếu là Navbar: Cho nó tràn 100% màn hình
        if (block.type === 'NAVBAR') return <Component key={index} data={block.payload} />;

        // Các section khác: Bọc vào Container của UI_SETTING để thẳng hàng
        return (
          <Mui.Container 
            key={index} 
            maxWidth={UI_SETTING.LAYOUT.CONTAINER_MAX_WIDTH}
            sx={{ 
              px: UI_SETTING.LAYOUT.PAGE_PADDING_X,
              mt: UI_SETTING.LAYOUT.SECTION_SPACING // Dùng khoảng cách md: 8 của bạn
            }}
          >
            <Component payload={block.payload} />
          </Mui.Container>
        );
      })}
    </>
  );
};
export default PageBuilder;