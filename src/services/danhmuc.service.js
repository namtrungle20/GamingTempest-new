// services/category.service.js
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

export const danhmucService = {
    // Lấy danh sách có phân trang và tìm kiếm
    getAll: async (params = { page: 1, limit: 10, search: '' }) => {
        try {
            const response = await apiConfig.get(API.DANHMUC.LIST, { params })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy danh mục' }
        }
    },

    // Lấy chi tiết
    //   getById: async (id) => {
    //     try {
    //       const response = await apiConfig.get(`/danhmuc/${id}`)
    //       return { success: true, raw: response.data }
    //     } catch (error) {
    //       return { success: false, message: error.response?.data?.message || 'Lỗi lấy chi tiết' }
    //     }
    //   },

    // Thêm mới
    create: async (data) => {
        try {
            const response = await apiConfig.post(API.DANHMUC.LIST, data)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi thêm danh mục' }
        }
    },

    // Cập nhật
    update: async (id, data) => {
        try {
            const response = await apiConfig.put(`${API.DANHMUC.LIST}/${id}`, data)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi cập nhật danh mục' }
        }
    },

    // Xóa
    remove: async (id) => {
        try {
            const response = await apiConfig.delete(`${API.DANHMUC.LIST}/${id}`)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xóa danh mục' }
        }
    },
}