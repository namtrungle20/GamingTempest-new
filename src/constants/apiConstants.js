export const API = {
    AUTH: {
        LOGIN: '/auth/dangnhap',
        REGISTER: '/auth/dangky',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
    },
    USERS: {
        LIST: '/nguoidung/danh-sach',
        DETAIL: '/nguoidung/chi-tiet',
        UPDATE: '/nguoidung/update',
        DELETE: '/nguoidung/delete',
    },
    PRODUCTS: {
        LIST: '/sanpham',
        CREATE: '/sanpham',
        UPDATE: '/sanpham',
        DELETE: '/sanpham',
    },
    ORDERS: {
        LIST: '/donhang',
        UPDATE: (id) => `/donhang/${id}`,
    },
    BRANDS: {
        LIST: '/thuonghieu',
    },
    CATEGORIES: {
        LIST: '/loaisanpham',
    },
    IMAGES: {
        UPLOAD: '/images/cloudinary/upload',
    },
    DANHMUC: {
        LIST: '/danhmuc',
    },
    HINHANH: {
        LIST: '/hinhanhsanpham',
        DETAIL: (id) => `/hinhanhsanpham/${id}`,
    },
    GIOHANG: {
        ME: '/giohang/me',
        ADD: '/giohang/me/them',
        UPDATE: '/giohang/me/capnhat',
        DELETE: (sanpham_id) => `/giohang/me/xoa/${sanpham_id}`,
    }
}