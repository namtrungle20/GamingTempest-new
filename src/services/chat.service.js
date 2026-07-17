import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

const chatService = {
    getLichSuChat: async (nguoidungId) => {
        const res = await apiConfig.get(API.CHAT.HOITHOAI(nguoidungId))
        return res.data.data
    },

    guiTinNhan: async ({ noidung, nguoidungId, guestId, isAdmin }) => {
        const payload = isAdmin
            ? { nguoidung_id: nguoidungId, guest_id: guestId, noidung }
            : nguoidungId
                ? { nguoidung_id: nguoidungId, noidung }
                : { guest_id: guestId, noidung }
        const res = await apiConfig.post(API.CHAT.MESS, payload)
        return res.data.data
    },

    getDanhSachHoiThoai: async () => {
        const res = await apiConfig.get(API.CHAT.ADMIN_HOITHOAI)
        return res.data.data
    },
}

export default chatService