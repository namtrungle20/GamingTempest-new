export default class DanhMuc {
    constructor(data) {
        this.id = data.danhmuc_id;
        this.ten = data.ten;
        this.name = data.ten;   // alias
        this.thutu = data.thutu
        this.trangthai = data.trangthai
    }
}