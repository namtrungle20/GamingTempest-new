import React from 'react';
import PageBuilder from '../layout/PageBuilder';
import { PRODUCT_DATA } from '../constants/productData';

const MOCK_DATA = [
  { type: 'NAVBAR', payload: {} },
  {
    type: 'MAIN_BANNER',
    payload: {
      mainBanner: [
        "https://file.hstatic.net/1000231532/collection/nintendo_switch_2_nshop_chinh_hang_cbf6a04687a84f3eadb6033a78ac825e.jpg",
        "https://cdn.hstatic.net/themes/1000231532/1001452980/14/slideshow_1.jpg?v=99",
        "https://cdn.hstatic.net/themes/1000231532/1001452980/14/slideshow_3.jpg?v=99"
      ]
    }
  },
  {
    type: "PRODUCT_SHELF",
    payload: {
      title: "🔥 Hàng mới cập bến",
      limit: 6,
      items: PRODUCT_DATA.NEW_ARRIVALS // Dùng data giả ở đây
    }
  },
  // Khối Sản phẩm yêu thích
  {
    type: "PRODUCT_SHELF",
    payload: {
      title: "❤️ Sản phẩm được yêu thích nhất",
      items: PRODUCT_DATA.FAVORITES // Dùng data giả ở đây
    }
  }
];

const HomePage = () => {
  return <PageBuilder pageConfig={MOCK_DATA} />;
};

export default HomePage;