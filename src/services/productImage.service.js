import apiConfig from '@/config/apiConfig';
import { API } from '@/constants/apiConstants';


export const parseYoutubeUrl = (url) => {
    if (!url) return null
    // Các dạng URL YouTube phổ biến:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    const patterns = [
        /youtube\.com\/watch\?v=([^&\s]+)/,
        /youtu\.be\/([^?\s]+)/,
        /youtube\.com\/embed\/([^?\s]+)/,
    ]
    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) return `https://www.youtube.com/embed/${match[1]}`
    }
    return null
}

export const hinhAnhService = {
    getAll: async (params) => {
        try {
            const response = await apiConfig.get(API.HINHANH.LIST, { params });
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy danh sách ảnh' };
        }
    },
    getById: async (id) => {
        try {
            const response = await apiConfig.get(API.HINHANH.DETAIL(id));
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi lấy chi tiết ảnh' };
        }
    },
    create: async (data) => {
        try {
            const response = await apiConfig.post(API.HINHANH.ADD_URL, data);
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi thêm ảnh' };
        }
    },

    addYoutubeVideo: async ({ sanpham_id, youtube_url }) => {
        const embedUrl = parseYoutubeUrl(youtube_url)
        if (!embedUrl) {
            return { success: false, message: 'URL YouTube không hợp lệ' }
        }
        try {
            const response = await apiConfig.post(API.HINHANH.ADD_URL, {
                sanpham_id,
                image_url: embedUrl,
                type: 'video',
            });
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi thêm video' };
        }
    },

    remove: async (id) => {
        try {
            const response = await apiConfig.delete(API.HINHANH.DETAIL(id));
            return { success: true, raw: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Lỗi xóa ảnh' };
        }
    },
};