// hook/admin/useLoaiSPManage.js
import { useState, useCallback } from 'react';
import useCatalogManage from './useCatalogManage';
import { categoryService } from '@/services/category.service';
import Category from '@/models/Category';
import { danhmucService } from '@/services/danhmuc.service';

const useLoaiSPManage = () => {
    // 1. Khởi tạo baseHook
    const initialForm = { name: '', danhmuc_id: '', image: null };
    const baseHook = useCatalogManage(categoryService, Category, initialForm);

    // 2. State cho danh sách danh mục cha
    const [danhMucs, setDanhMucs] = useState([]);
    const [loadingDanhMucs, setLoadingDanhMucs] = useState(false);

    // 3. Hàm fetch danh mục cha
    const fetchDanhMucs = useCallback(async () => {
        setLoadingDanhMucs(true);
        const res = await danhmucService.getAll({ limit: 100 });
        if (res.success) setDanhMucs(res.raw.data || []);
        setLoadingDanhMucs(false);
    }, []);

    // 4. Override openCreate và openEdit
    const openCreate = useCallback(async () => {
        await fetchDanhMucs();
        baseHook.openCreate();
    }, [fetchDanhMucs, baseHook]);

    const openEdit = useCallback(async(item) => {
        await fetchDanhMucs();
        baseHook.openEdit(item);
    }, [fetchDanhMucs, baseHook]);

    // 5. Trả về kết hợp
    return {
        ...baseHook,
        openCreate,
        openEdit,
        danhMucs,
        loadingDanhMucs,
    };
};

export default useLoaiSPManage;