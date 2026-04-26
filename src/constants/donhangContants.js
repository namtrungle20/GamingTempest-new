// constants/donhangConstants.js

export const TRANG_THAI_DON_HANG = {
    CHO_XAC_NHAN: 0,
    DA_XAC_NHAN: 1,
    DANG_GIAO: 2,
    DA_GIAO: 3,
    DA_HUY: 4,
    DA_THANH_TOAN: 5,
}

export const TRANG_THAI_LABEL = {
    [TRANG_THAI_DON_HANG.CHO_XAC_NHAN]: { label: 'Chờ xác nhận', color: 'warning' },
    [TRANG_THAI_DON_HANG.DA_XAC_NHAN]: { label: 'Đã xác nhận', color: 'info' },
    [TRANG_THAI_DON_HANG.DANG_GIAO]: { label: 'Đang giao', color: 'primary' },
    [TRANG_THAI_DON_HANG.DA_GIAO]: { label: 'Đã giao', color: 'success' },
    [TRANG_THAI_DON_HANG.DA_HUY]: { label: 'Đã hủy', color: 'error' },
    [TRANG_THAI_DON_HANG.DA_THANH_TOAN]: { label: 'Đã thanh toán', color: 'success' },
}

// Các trạng thái admin được phép chuyển sang
export const NEXT_TRANG_THAI = {
    [TRANG_THAI_DON_HANG.CHO_XAC_NHAN]: [TRANG_THAI_DON_HANG.DA_XAC_NHAN, TRANG_THAI_DON_HANG.DA_HUY],
    [TRANG_THAI_DON_HANG.DA_XAC_NHAN]: [TRANG_THAI_DON_HANG.DANG_GIAO, TRANG_THAI_DON_HANG.DA_HUY],
    [TRANG_THAI_DON_HANG.DANG_GIAO]: [TRANG_THAI_DON_HANG.DA_GIAO],
    [TRANG_THAI_DON_HANG.DA_GIAO]: [],
    [TRANG_THAI_DON_HANG.DA_HUY]: [],
    [TRANG_THAI_DON_HANG.DA_THANH_TOAN]: [],
}

export const KHONG_THE_HUY = [
    TRANG_THAI_DON_HANG.DA_HUY,
    TRANG_THAI_DON_HANG.DA_THANH_TOAN,
    TRANG_THAI_DON_HANG.DA_GIAO,
]