// services/donhang.service.js
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

export const donHangService = {
    getAll: async (params = {}) => {
        try {
            const response = await apiConfig.get(API.ORDERS.LIST, { params })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy danh sách đơn hàng' }
        }
    },
    getMyOrders: async (params = {}) => {
        try {
            const response = await apiConfig.get(API.ORDERS.MY_LIST, { params })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy lịch sử đơn hàng' }
        }
    },
    getById: async (id) => {
        try {
            const response = await apiConfig.get(API.ORDERS.DETAIL(id))
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy đơn hàng' }
        }
    },
    update: async (id, payload) => {
        try {
            const response = await apiConfig.put(API.ORDERS.UPDATE(id), payload)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật đơn hàng' }
        }
    },
    remove: async (id, payload = {}) => {
        try {
            const response = await apiConfig.delete(API.ORDERS.DELETE(id), { data: payload, params: payload })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xóa đơn hàng' }
        }
    },
    getThongKe: async (params = {}) => {
        try {
            const response = await apiConfig.get(API.ORDERS.THONGKE, { params })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy thống kê dashboard' }
        }
    }
}
