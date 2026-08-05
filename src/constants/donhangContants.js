// constants/donhangConstants.js

export const TRANG_THAI_DON_HANG = {
    CHO_XAC_NHAN: 0,
    DA_HUY: 1,
    DA_THANH_TOAN: 2,
}

export const HUY_BOI_LABEL = {
    0: 'Khách hàng',
    1: 'Admin',
    2: 'Hệ thống',
}

export const LY_DO_HUY_LABEL = {
    0: 'Đổi ý, không muốn mua nữa',
    1: 'Tìm được giá rẻ hơn ở nơi khác',
    2: 'Đặt nhầm sản phẩm',
    3: 'Thời gian giao hàng quá lâu',
    4: 'Thanh toán thất bại',
    5: 'Lý do khác',
}

export const TRANG_THAI_LABEL = {
    [TRANG_THAI_DON_HANG.CHO_XAC_NHAN]: { label: 'Chờ xác nhận', color: 'warning' },
    [TRANG_THAI_DON_HANG.DA_HUY]: { label: 'Đã hủy', color: 'error' },
    [TRANG_THAI_DON_HANG.DA_THANH_TOAN]: { label: 'Đã thanh toán', color: 'success' },
}

// Các trạng thái admin được phép chuyển sang
export const NEXT_TRANG_THAI = {
    [TRANG_THAI_DON_HANG.CHO_XAC_NHAN]: [TRANG_THAI_DON_HANG.DA_THANH_TOAN, TRANG_THAI_DON_HANG.DA_HUY],
    [TRANG_THAI_DON_HANG.DA_HUY]: [],
    [TRANG_THAI_DON_HANG.DA_THANH_TOAN]: [],
}

export const KHONG_THE_HUY = [
    TRANG_THAI_DON_HANG.DA_HUY,
    TRANG_THAI_DON_HANG.DA_THANH_TOAN
]