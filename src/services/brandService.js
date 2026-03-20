import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

export const brandService = {
    getAll: async (params) => {
        try {
            const response = await apiConfig.get(API.BRANDS.LIST, { params })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    create: async (formData) => {
        try {
            const response = await apiConfig.post(API.BRANDS.LIST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    update: async (id, formData) => {
        try {
            const response = await apiConfig.put(`${API.BRANDS.LIST}/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    remove: async (id) => {
        try {
            const response = await apiConfig.delete(`${API.BRANDS.LIST}/${id}`)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
}