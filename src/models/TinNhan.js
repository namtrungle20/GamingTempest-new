import { USER_ROLE } from '@/constants/UserConstants.js'

class TinNhan {
    constructor(data) {
        this.id = data.tinnhan_id
        this.nguoidungId = data.nguoidung_id
        this.noidung = data.noidung
        this.guestId = data.guest_id
        this.nguoiGui = data.nguoi_gui
        this.createdAt = data.created_at
    }

    get isAdmin() {
        return this.nguoiGui === USER_ROLE.ADMIN
    }

    get isCustomer() {
        return this.nguoiGui === USER_ROLE.CUSTOMER
    }
}

export default TinNhan