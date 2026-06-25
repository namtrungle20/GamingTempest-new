export default class DanhGia {
    constructor(data = {}) {
        this.id = data.danhgia_id
        this.sanpham_id = data.sanpham_id
        this.nguoidung_id = data.nguoidung_id
        this.binhluan = data.binhluan
        this.sosao = data.sosao
        this.createdAt = data.created_at
        this.updatedAt = data.updated_at
    }
}