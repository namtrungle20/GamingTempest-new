// hook/admin/useProductImageManager.js
import { useState, useCallback, useEffect, useRef } from 'react';
import { hinhAnhService } from '@/services/productImage.service';
import { uploadService } from '@/services/upload.service';

const useProductImageManager = (sanpham_id) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ total: 0, done: 0 })
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

    const uploadImages = async (files) => {
        if (!sanpham_id) {
            alert('Chưa có ID sản phẩm, hãy lưu sản phẩm trước khi thêm ảnh')
            return
        }
        if (!files?.length) return

        setUploading(true)
        setUploadProgress({ total: files.length, done: 0 })

        // 1. Upload tất cả file lên Cloudinary 1 lần (nhanh hơn nhiều so với for loop)
        const uploadResult = await uploadService.uploadToLibrary(files)
        if (!uploadResult.success) {
            alert(uploadResult.message)
            setUploading(false)
            return
        }

        // 2. Gán từng ảnh vào sản phẩm song song
        const assignResults = await Promise.allSettled(
            uploadResult.data.map(img =>
                uploadService.assignToProduct(sanpham_id, img.url, img.public_id)
            )
        )

        const failedCount = assignResults.filter(r => r.status === 'rejected' || !r.value?.success).length
        if (failedCount > 0) {
            alert(`${failedCount} ảnh gán thất bại (có thể đã trùng)`)
        }

        setUploadProgress({ total: files.length, done: files.length })
        setUploading(false)
        setUploadProgress({ total: 0, done: 0 })
        fetchImages()
    }

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
        uploadProgress,
        uploadImage: uploadImages,
        deleteImage,
        refetch: fetchImages,
    };
};

export default useProductImageManager;