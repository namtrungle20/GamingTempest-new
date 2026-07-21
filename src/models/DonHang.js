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
        this.giam_gia = Number(data.giam_gia || 0)
        this.sdt = data.sdt
        this.created_at = data.created_at
        this.updated_at = data.updated_at
        this.phi_van_chuyen = Number(data.phi_van_chuyen || 0)

        this.nguoiDung = data.NguoiDung || null
        this.chiTiet = (data.ChiTietDonHangs || []).map(ct => new ChiTietDonHangModel(ct))
    }

    // Hiển thị mã đơn rút gọn
    get shortId() {
        return this.donhang_id.slice(0, 8).toUpperCase()
    }
    get phiVanChuyenFormatted() {
        return fmt(this.phi_van_chuyen)
    }
    get giamGiaFormatted() {
        return fmt(this.giam_gia)
    }
    get tienHang() {
        return this.tongtien - this.phi_van_chuyen + (this.giam_gia || 0)
    }
    // Tổng tiền đã format VND
    get tienHangFormatted() {  // ✅ thiếu getter này — cần thêm để dòng "Tạm tính" hoạt động
        return fmt(this.tienHang)
    }

    // Tổng tiền đã format VND — dùng đúng tongtien
    get tongTienFormatted() {
        return fmt(this.tongtien)
    }

    // Label + color của trạng thái
    get trangThaiInfo() {
        return TRANG_THAI_LABEL[this.trangthai] ?? { label: 'Không rõ', color: 'default' }
    }

    get trangThaiLabel() { return this.trangThaiInfo.label }
    get trangThaiColor() { return this.trangThaiInfo.color }

    // Ngày tạo format
    get createdAtFormatted() {
        return fmtDate(this.created_at)
    }

    get updatedAtFormatted() {
        return fmtDate(this.updated_at)
    }

    // Factory từ array API response
    static fromList(list = []) {
        return list.map(item => new DonHang(item))
    }
}