// services/upload.service.js
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'

export const uploadService = {
  uploadImage: async (file, sanpham_id) => {
    const formData = new FormData()
    formData.append('images', file) // Key phải khớp với backend Cloudinary API
    formData.append('sanpham_id', sanpham_id)
    try {
      const response = await apiConfig.post(API.IMAGES.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })


      const img = response.data.data[0]
      return {
        success: true,
        url: img.image_url,
        public_id: img.public_id,
      }
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: error.response?.data?.message || 'Upload ảnh thất bại' }
    }
  },

  bulkUpload: async (files) => {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    try {
      const response = await apiConfig.post(API.IMAGES.BULK_UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob', // ✅ nhận file Excel
      })
      return { success: true, blob: response.data }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Upload thất bại' }
    }
  }
}