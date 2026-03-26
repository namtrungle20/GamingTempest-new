// services/upload.service.js
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

export const uploadService = {
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('image', file) // Key phải khớp với backend Cloudinary API
    try {
      const response = await apiConfig.post(API.IMAGES.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return { success: true, url: response.data.file, public_id: response.data.public_id }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Upload ảnh thất bại' }
    }
  }
}