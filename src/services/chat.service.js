import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

const chatService = {
    getLichSuChat: async (id, isGuest = false) => {
        const res = await apiConfig.get(`${API.CHAT.HOITHOAI(id)}?isGuest=${isGuest}`)
        return res.data.data
    },

    guiTinNhan: async ({ noidung, nguoidungId, guestId, isAdmin }) => {
        const payload = isAdmin
            ? (guestId ? { guest_id: guestId, noidung } : { nguoidung_id: nguoidungId, noidung })
            : (nguoidungId ? { nguoidung_id: nguoidungId, noidung } : { guest_id: guestId, noidung })
        const res = await apiConfig.post(API.CHAT.MESS, payload)
        return res.data.data
    },

    getDanhSachHoiThoai: async (limit = 20, offset = 0) => {
        const res = await apiConfig.get(`${API.CHAT.ADMIN_HOITHOAI}?limit=${limit}&offset=${offset}`)
        return res.data.data
    },

    xoaHoiThoai: async (id, isGuest) => {
        const res = await apiConfig.delete(`${API.CHAT.DELETE(id)}?isGuest=${isGuest}`)
        return res.data.data
    },

    mergeGuest: async (guestId) => {
        const res = await apiConfig.post(API.CHAT.MERGE_GUEST, { guest_id: guestId })
        return res.data.data
    },
}

export default chatService