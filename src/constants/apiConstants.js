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
        CHANGE_PASSWORD: '/nguoidung/doi-mat-khau',
    },
    PRODUCTS: {
        LIST: '/sanpham',
        CREATE: '/sanpham',
        UPDATE: '/sanpham',
        DELETE: '/sanpham',
        IMPORT: '/sanpham/import/full',
    },
    ORDERS: {
        LIST: '/donhang',
        MY_LIST: '/donhang/me',
        DETAIL: (id) => `/donhang/${id}`,
        UPDATE: (id) => `/donhang/${id}`,
        DELETE: (id) => `/donhang/${id}`,
    },
    BRANDS: {
        LIST: '/thuonghieu',
    },
    CATEGORIES: {
        LIST: '/loaisanpham',
    },
    IMAGES: {
        UPLOAD: '/hinhanhsanpham',
        UPLOAD_LIBRARY: '/images/cloudinary/upload',
        ASSIGN: '/images/cloudinary/assign',
        CLOUDINARY_ALL: '/images/cloudinary/all',
        DELETE: '/images/delete',
    },
    DANHMUC: {
        LIST: '/danhmuc',
    },
    HINHANH: {
        LIST: '/hinhanhsanpham',
        DETAIL: (id) => `/hinhanhsanpham/${id}`,
        ADD_URL: '/hinhanhsanpham/url',
    },
    GIOHANG: {
        ME: '/giohang/me',
        ADD: '/giohang/me/them',
        UPDATE: '/giohang/me/capnhat',
        DELETE: (sanpham_id) => `/giohang/me/xoa/${sanpham_id}`,
        CHECKOUT: '/giohang/me/thanhtoan',
    },
    THANHTOAN: {
        CREATE: '/thanhtoan/create',
        RETURN: '/thanhtoan/return',
        // DETAIL: (id) => `/thanhtoan/${id}`,
    },
}