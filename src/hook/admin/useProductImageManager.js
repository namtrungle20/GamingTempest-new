// hook/admin/useProductImageManager.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { hinhAnhService } from '@/services/productImage.service';
import { uploadService } from '@/services/upload.service';

const useProductImageManager = (sanpham_id) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const abortControllerRef = useRef(null);

    const fetchImages = useCallback(async () => {
        if (!sanpham_id) return;
        // Hủy request cũ nếu đang chạy
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        setImages([]);
        // Lọc ảnh theo sanpham_id (backend có thể hỗ trợ query params)
        const res = await hinhAnhService.getAll({ sanpham_id }, { signal: controller.signal });
        if (!controller.signal.aborted && res.success) {
            setImages(res.raw.data || []);
        }
        setLoading(false);
    }, [sanpham_id]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const uploadImage = async (file) => {
        if (!sanpham_id) {
            alert('Chưa có ID sản phẩm, hãy lưu sản phẩm trước khi thêm ảnh');
            return false;
        }
        setUploading(true);
        // Upload lên Cloudinary trước
        const uploadResult = await uploadService.uploadImage(file);
        if (!uploadResult.success) {
            alert(uploadResult.message);
            setUploading(false);
            return false;
        }
        // Sau đó gọi API backend để lưu URL vào bảng hinhanhsanpham
        const createResult = await hinhAnhService.create({
            sanpham_id: sanpham_id,
            image_url: uploadResult.url,
        });
        setUploading(false);
        if (createResult.success) {
            fetchImages(); // refresh danh sách
            return true;
        } else {
            alert(createResult.message);
            return false;
        }
    };

    const deleteImage = async (imageId) => {
        if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
            const result = await hinhAnhService.remove(imageId);
            if (result.success) {
                fetchImages();
            } else {
                alert(result.message);
            }
        }
    };

    return {
        images,
        loading,
        uploading,
        uploadImage,
        deleteImage,
        refetch: fetchImages,
    };
};

export default useProductImageManager;