  export const UI_SETTING = {
    // Chiều cao Navbar để các trang khác tự động padding-top không bị đè nội dung
    NAVBAR_HEIGHT: {
      xs: 64,
      md: 80,
    },

    // Cấu hình Mega Menu
    MEGA_MENU: {
      MAX_COLUMNS: 5,
      ITEM_GAP: 3,
      PANEL_PADDING: 1,
      ANIMATION_SPEED: '0.2s',
    },

    // Các con số vàng về lề (Spacing)
    LAYOUT: {
      CONTAINER_MAX_WIDTH: 'xl',
      PAGE_PADDING_X: { xs: 2, md: 4 },
      SECTION_SPACING: { xs: 4, md: 8 },
    },

    // Bo góc đồng nhất cho Card, Button, Paper
    SHAPE: {
      CARD_RADIUS: 2, // 2 * 8px = 16px
      BUTTON_RADIUS: 1, // 8px
    },

    // Z-index để không bị lộn xộn lớp phủ
    Z_INDEX: {
      NAVBAR: 1100,
      MEGA_MENU: 1000,
      MODAL: 1300,
    },

    MODAL: {
      WIDTH: 450,
      RADIUS: 3,
      PADDING: 4
    },
  }