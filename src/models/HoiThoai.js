class HoiThoai {
    constructor(data) {
        this.nguoidungId = data.nguoidung_id
        this.guestId = data.guest_id
        this.name = data.name || (data.guest_id ? 'Khách vãng lai' : 'Người dùng')
        this.sdt = data.sdt
        this.tinNhanCuoi = data.noidung
        this.thoiGian = data.created_at
    }

    get hoiThoaiKey() {
        return this.nguoidungId || this.guestId
    }
}

export default HoiThoai