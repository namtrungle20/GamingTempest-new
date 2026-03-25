import { LOCK_STATUS, LOCK_LABEL, USER_ROLE } from '@/constants/UserConstants'
export default class User {
    constructor(data = {}) {
        this.id = data.nguoidung_id; // Khớp với Postman
        this.email = data.email || "";
        this.sdt = data.sdt || "";
        this.diachi = data.diachi || "";
        this.vaitro = data.vaitro; // 2 thường là User, 1 thường là Admin
        this.ngayvao = data.ngayvao;
        this.ngayhoatdong = data.ngayhoatdong;
        this.trangthai = data.trangthai ?? LOCK_STATUS.ACTIVE
        this.deleted_at = data.deleted_at;
    }

    // Getter kiểm tra quyền Admin nhanh (Giả sử vaitro === 1 là Admin)
    get isAdmin() { return this.vaitro === USER_ROLE.ADMIN }
    get isLock() { return this.trangthai === LOCK_STATUS.LOCKED }
    get isDeleted() { return this.trangthai === LOCK_STATUS.DELETE }
    get trangthaiLabel() { return LOCK_LABEL[this.trangthai] ?? 'Không xác định' }

    get displayName() {
        return this.email ? this.email.split('@')[0] : "User";
    }
    get imageUrl() {
        if (!this.image) return null
        if (this.image.startsWith('http')) return this.image
        return `${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${this.image}`
    }
}