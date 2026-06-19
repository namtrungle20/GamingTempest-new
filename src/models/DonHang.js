import { TRANG_THAI_LABEL } from '@/constants/donhangContants'

const fmt = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
const fmtDate = (d) => new Date(d).toLocaleString('vi-VN')

export class ChiTietDonHangModel {
    constructor(data) {
        this.id = data.id
        this.sanpham_id = data.SanPham?.sanpham_id
        this.soluong = data.soluong
        this.dongia = Number(data.dongia)
        this.ten = data.SanPham?.name || data.sanpham_id
        this.anhDaiDien = data.SanPham?.HinhAnhSanPham?.[0]?.image_url || null
    }

    get tongTien() { return this.dongia * this.soluong }
    get tongTienFormatted() { return fmt(this.tongTien) }
    get dongiaFormatted() { return fmt(this.dongia) }
}



export default class DonHang {
    constructor(data) {
        this.donhang_id = data.donhang_id
        this.nguoidung_id = data.nguoidung_id
        this.tongtien = Number(data.tongtien)
        this.trangthai = data.trangthai
        this.diachi = data.diachi
        this.sdt = data.sdt

        this.nguoiDung = data.NguoiDung || null
        this.chiTiet = (data.ChiTietDonHangs || []).map(ct => new ChiTietDonHangModel(ct))
    }

    // Hiển thị mã đơn rút gọn
    get shortId() {
        return this.donhang_id.slice(0, 8).toUpperCase()
    }

    // Tổng tiền đã format VND
    get tongTienFormatted() {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(this.tongtien)
    }

    // Label + color của trạng thái
    get trangThaiInfo() {
        return TRANG_THAI_LABEL[this.trangthai] ?? { label: 'Không rõ', color: 'default' }
    }

    get trangThaiLabel() { return this.trangThaiInfo.label }
    get trangThaiColor() { return this.trangThaiInfo.color }

    // Ngày tạo format
    get createdAtFormatted() {
        return new Date(this.createdAt).toLocaleString('vi-VN')
    }

    get updatedAtFormatted() {
        return new Date(this.updatedAt).toLocaleString('vi-VN')
    }

    // Factory từ array API response
    static fromList(list = []) {
        return list.map(item => new DonHang(item))
    }
}