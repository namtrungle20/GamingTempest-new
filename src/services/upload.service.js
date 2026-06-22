import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

export const uploadService = {
  // Upload ảnh vào sản phẩm (có sanpham_id)
  uploadToProduct: async (files, sanpham_id) => {
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('images', file))
    formData.append('sanpham_id', sanpham_id)
    try {
      const res = await apiConfig.post(API.IMAGES.UPLOAD, formData)
      return { success: true, data: res.data.data }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Upload ảnh thất bại' }
    }
  },

  // Upload ảnh lên library (chưa gán sản phẩm)
  uploadToLibrary: async (files) => {
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('images', file))
    try {
      const res = await apiConfig.post(API.IMAGES.UPLOAD_LIBRARY, formData)
      return { success: true, data: res.data.data }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Upload thất bại' }
    }
  },



  // Gán ảnh từ library vào sản phẩm
  assignToProduct: async (sanpham_id, image_url, public_id) => {
    try {
      const res = await apiConfig.post(API.IMAGES.ASSIGN, { sanpham_id, image_url, public_id })
      return { success: true, data: res.data.data }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Gán ảnh thất bại' }
    }
  }
}