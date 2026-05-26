import { useState, useEffect, useCallback, useRef } from 'react';
import { productService } from '@/services/product.service.js'
import { danhmucService } from '@/services/danhmuc.service.js'
import Product from '@/models/Product'
import { uploadService } from '@/services/upload.service.js';

const INITIAL_FORM = {
    name: '', mota: '', gia: '', soluong: '',
    loai_id: '', thuonghieu_id: ''
}

const useSanPhamManage = () => {
    const [sanPhams, setSanPhams] = useState([])
    const [brands, setBrands] = useState([])
    const [categories, setCategories] = useState([])
    const [danhmucs, setDanhMucs] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' })
    const [editTarget, setEditTarget] = useState(null)
    const [form, setForm] = useState(INITIAL_FORM)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const notify = useCallback((message, severity = 'success') =>
        setSnackbar({ open: true, message, severity }), [])

    const closeSnackbar = useCallback(() =>
        setSnackbar(prev => ({ ...prev, open: false })), [])

    const fetchSanPhams = useCallback(async () => {
        setLoading(true)
        const result = await productService.getAll({ page, search })
        if (result.success) {
            setSanPhams((result.raw.data || []).map(p => new Product(p)))
            setTotal(result.raw.total || 0)
        } else {
            notify(result.message, 'error')
        }
        setLoading(false)
    }, [page, search, notify])

    const fetchMeta = useCallback(async () => {
        const [brandResult, categoryResult, danhMucResult] = await Promise.allSettled([
            productService.getBrands(),
            productService.getCategories(),
            danhmucService.getAll({ limit: 100 }),
        ])
        if (brandResult.status === 'fulfilled' && brandResult.value.success)
            setBrands(brandResult.value.raw.data || [])
        if (categoryResult.status === 'fulfilled' && categoryResult.value.success)
            setCategories(categoryResult.value.raw.data || [])
        if (danhMucResult.status === 'fulfilled') setDanhMucs(danhMucResult.value.raw.data || [])
    }, [])

    useEffect(() => { fetchSanPhams() }, [fetchSanPhams])
    useEffect(() => { fetchMeta() }, [fetchMeta])

    const openCreate = useCallback(async () => {
        await fetchMeta()
        setEditTarget(null)
        setForm(INITIAL_FORM)
        setModalOpen(true)
    }, [fetchMeta])

    const openEdit = useCallback(async (sanpham) => {
        await fetchMeta()
        setEditTarget(sanpham)
        setForm({
            name: sanpham.name || '',
            mota: sanpham.mota || '',
            gia: sanpham.gia || '',
            soluong: sanpham.soluong || '',
            loai_id: sanpham.loai_id || '',
            thuonghieu_id: sanpham.thuonghieu_id || '',
        })
        setModalOpen(true)
    }, [fetchMeta])

    const closeModal = useCallback(() => {
        setModalOpen(false)
        setEditTarget(null)
        setForm(INITIAL_FORM)
    }, [])

    const handleFormChange = useCallback((field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }, [])

    const handleSubmit = useCallback(async () => {
        const payload = {
            name: form.name,
            mota: form.mota,
            gia: Number(form.gia),
            soluong: Number(form.soluong),
            loai_id: Number(form.loai_id),
            thuonghieu_id: Number(form.thuonghieu_id),
        };
        const result = editTarget
            ? await productService.update(editTarget.id, payload)
            : await productService.create(payload);

        if (result.success) {
            notify(editTarget ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công');
            closeModal();
            fetchSanPhams();
        } else {
            notify(result.message, 'error');
        }
    }, [form, editTarget, notify, closeModal, fetchSanPhams]);

    const handleImport = async (file) => {
        if (!file) return
        const result = await productService.importFull(file)
        if (result.success) {
            const { data } = result.raw
            const totalSuccess = Object.values(data).reduce((acc, s) => acc + (s.success?.length || 0), 0)
            const totalError = Object.values(data).reduce((acc, s) => acc + (s.errors?.length || 0), 0)
            notify(`Import xong: ${totalSuccess} thành công${totalError > 0 ? `, ${totalError} lỗi` : ''}`)
            fetchSanPhams()
        } else {
            notify(result.message)
        }
    }

    const openDeleteDialog = useCallback((id, name) => {
        setDeleteDialog({ open: true, id, name })
    }, [])

    const closeDeleteDialog = useCallback(() => {
        setDeleteDialog({ open: false, id: null, name: '' })
    }, [])

    const handleDelete = useCallback(async () => {
        const result = await productService.remove(deleteDialog.id)
        if (result.success) {
            notify('Xóa sản phẩm thành công')
            closeDeleteDialog()
            fetchSanPhams()
        } else {
            notify(result.message, 'error')
        }
    }, [deleteDialog.id, notify, closeDeleteDialog, fetchSanPhams])

    return {
        sanPhams, brands, categories, danhmucs, loading, total, page, search,
        fetchMeta, modalOpen, editTarget, form, deleteDialog, snackbar,
        setPage, setSearch, notify, closeSnackbar,
        openCreate, openEdit, closeModal,
        handleFormChange, handleSubmit,
        openDeleteDialog, closeDeleteDialog, handleDelete, handleImport
    }
}

export default useSanPhamManage