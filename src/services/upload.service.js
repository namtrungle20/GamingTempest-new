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

      // 🔍 Debug: in response để xem cấu trúc
      console.log('Cloudinary upload response:', response.data)

      // Lấy URL từ nhiều trường có thể có
      let imageUrl = null;
      let publicId = null;

      if (response.data.url) {
        imageUrl = response.data.url;
        publicId = response.data.public_id;
      } else if (response.data.file) {
        imageUrl = response.data.file;
        publicId = response.data.public_id;
      } else if (response.data.data && response.data.data.image_url) {
        imageUrl = response.data.data.image_url;
        publicId = response.data.data.public_id;
      } else if (response.data.secure_url) {
        imageUrl = response.data.secure_url;
        publicId = response.data.public_id;
      } else {
        console.error('Không tìm thấy URL trong response:', response.data);
        return { success: false, message: 'Response không chứa URL ảnh' };
      }

      return {
        success: true,
        url: imageUrl,
        public_id: publicId
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: error.response?.data?.message || 'Upload ảnh thất bại' }
    }
  }
}