import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

export const productService = {
    getAll: async (params) => {
        try {
            const response = await apiConfig.get(API.PRODUCTS.LIST, { params })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    getById: async (id) => {
        try {
            const response = await apiConfig.get(`${API.PRODUCTS.LIST}/${id}`)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    create: async (formData) => {
        try {
            const response = await apiConfig.post(API.PRODUCTS.LIST, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    update: async (id, formData) => {
        try {
            const response = await apiConfig.put(`${API.PRODUCTS.LIST}/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    remove: async (id) => {
        try {
            const response = await apiConfig.delete(`${API.PRODUCTS.LIST}/${id}`)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    getBrands: async () => {
        try {
            const response = await apiConfig.get(API.BRANDS.LIST)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
    getCategories: async () => {
        try {
            const response = await apiConfig.get(API.CATEGORIES.LIST)
            return { success: true, raw: response.data }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi server' }
        }
    },
}