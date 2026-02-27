export default class User {
    constructor(data = {}) {
        this.id = data.nguoidung_id; // Khớp với Postman
        this.email = data.email || "";
        this.sdt = data.sdt || "";
        this.diachi = data.diachi || "";
        this.vaitro = data.vaitro; // 2 thường là User, 1 thường là Admin
        this.ngayvao = data.ngayvao;
        this.ngayhoatdong = data.ngayhoatdong;
        this.isLock = data.is_lock === 1;
    }

    // Getter kiểm tra quyền Admin nhanh (Giả sử vaitro === 1 là Admin)
    get isAdmin() {
        return this.vaitro === 1;
    }

    get displayName() {
        return this.email ? this.email.split('@')[0] : "User";
    }
}