import { useState, useCallback, useEffect } from 'react';
import { chitietsanphamService } from '@/services/chitietsanpham.service';

const useChiTietSanPhamManager = (sanpham_id) => {
    const [chiTiets, setChiTiets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [form, setForm] = useState({ name: '', gia_tri: '' });

    const fetchChiTiet = useCallback(async () => {
        if (!sanpham_id) return;
        setLoading(true);
        const result = await chitietsanphamService.getAll(sanpham_id);
        if (result.success) setChiTiets(result.data || []);
        setLoading(false);
    }, [sanpham_id]);

    useEffect(() => { fetchChiTiet(); }, [fetchChiTiet]);

    const handleFormChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const openEdit = (ct) => {
        setEditTarget(ct);
        setForm({ name: ct.name, gia_tri: ct.gia_tri });
    }

    const closeEdit = () => {
        setEditTarget(null);
        setForm({ name: '', gia_tri: '' });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.gia_tri) return;
        const result = editTarget
            ? await chitietsanphamService.update(editTarget.id, form)
            : await chitietsanphamService.create({ sanpham_id, ...form });
        if (result.success) { fetchChiTiet(); closeEdit(); }
        return result;
    };

    const handleDelete = async (id) => {
        const result = await chitietsanphamService.remove(id);
        if (result.success) fetchChiTiet();
        return result;
    };

    return {
        chiTiets, loading, form, editTarget,
        handleFormChange, openEdit, closeEdit,
        handleSubmit, handleDelete, fetchChiTiet,
    };
};

export default useChiTietSanPhamManager;