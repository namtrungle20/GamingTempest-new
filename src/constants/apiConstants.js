export const API = {
    AUTH: {
        LIST: '/auth/me',
        LOGIN: '/auth/dangnhap',
        REGISTER: '/auth/dangky',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        GOOGLE: '/auth/google',
        QUEN_MAT_KHAU: '/auth/quenmatkhau',
        DAT_LAI_MAT_KHAU: '/auth/datlaimatkhau'
    },
    USERS: {
        LIST: '/nguoidung/danh-sach',
        DETAIL: '/nguoidung/chi-tiet',
        UPDATE: '/nguoidung/update',
        DELETE: '/nguoidung/delete',
        //---rank
        RANK: '/nguoidung/rank',
        RANK_UPDATE: '/nguoidung/rank/update',
        RANK_CHECK: '/nguoidung/rank/check',
        RANK_ALL_UPDATE: '/nguoidung/rank/all-update',
        CHANGE_PASSWORD: '/nguoidung/doi-mat-khau',
    },
    PRODUCTS: {
        LIST: '/sanpham',
        CREATE: '/sanpham',
        UPDATE: '/sanpham',
        DELETE: '/sanpham',
        IMPORT: '/sanpham/import/full',
        EXPORT: '/sanpham/export'
    },
    DANHGIA: {
        LIST: '/danhgia',
        ADMIN_LIST: '/danhgia/admin',
        CREATE: '/danhgia',
        DELETE: (id) => `/danhgia/${id}`,
        CHECK_DA_MUA: '/danhgia/check-mua'
    },
    CHITIETSANPHAM: {
        LIST: (sanpham_id) => `/chitiet?sanpham_id=${sanpham_id}`,
        CREATE: '/chitiet',
        BULK: '/chitiet/bulk',
        UPDATE: (id) => `/chitiet/${id}`,
        DELETE: (id) => `/chitiet/${id}`,
        DELETE_ALL: (sanpham_id) => `/chitiet/all?sanpham_id=${sanpham_id}`,
    },
    ORDERS: {
        LIST: '/donhang',
        MY_LIST: '/donhang/me',
        DETAIL: (id) => `/donhang/${id}`,
        UPDATE: (id) => `/donhang/${id}`,
        DELETE: (id) => `/donhang/${id}`,
        THONGKE: '/donhang/thongke/dashboard',
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
    CHAT: {
        MESS: '/chat',
        ADMIN_HOITHOAI: '/chat/admin/hoithoai',
        HOITHOAI: (id) => `/chat/${id}`,
    }
}