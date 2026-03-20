import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/productService'
import Product from '@/models/Product'

const INITIAL_FORM = {
    name: '', mota: '', gia: '', soluong: '',
    loai_id: '', thuonghieu_id: '', image: null
}

const useSanPhamManage = () => {
    const [sanPhams, setSanPhams] = useState([])
    const [brands, setBrands] = useState([])
    const [categories, setCategories] = useState([])
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
        const [brandResult, categoryResult] = await Promise.allSettled([
            productService.getBrands(),
            productService.getCategories(),
        ])
        if (brandResult.status === 'fulfilled' && brandResult.value.success)
            setBrands(brandResult.value.raw.data || [])
        if (categoryResult.status === 'fulfilled' && categoryResult.value.success)
            setCategories(categoryResult.value.raw.data || [])
    }, [])

    useEffect(() => { fetchSanPhams() }, [fetchSanPhams])
    useEffect(() => { fetchMeta() }, [fetchMeta])

    const openCreate = useCallback(() => {
        setEditTarget(null)
        setForm(INITIAL_FORM)
        setModalOpen(true)
    }, [])

    const openEdit = useCallback((sanpham) => {
        setEditTarget(sanpham)
        setForm({
            name: sanpham.name || '',
            mota: sanpham.mota || '',
            gia: sanpham.gia || '',
            soluong: sanpham.soluong || '',
            loai_id: sanpham.loai_id || '',
            thuonghieu_id: sanpham.thuonghieu_id || '',
            image: null,
        })
        setModalOpen(true)
    }, [])

    const closeModal = useCallback(() => {
        setModalOpen(false)
        setEditTarget(null)
        setForm(INITIAL_FORM)
    }, [])

    const handleFormChange = useCallback((field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }, [])

    const handleSubmit = useCallback(async () => {
        const formData = new FormData()
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== '') formData.append(key, value)
        })

        const result = editTarget
            ? await productService.update(editTarget.sanpham_id, formData)
            : await productService.create(formData)

        if (result.success) {
            notify(editTarget ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công')
            closeModal()
            fetchSanPhams()
        } else {
            notify(result.message, 'error')
        }
    }, [form, editTarget, notify, closeModal, fetchSanPhams])

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
        sanPhams, brands, categories, loading, total, page, search,
        modalOpen, editTarget, form, deleteDialog, snackbar,
        setPage, setSearch, notify, closeSnackbar,
        openCreate, openEdit, closeModal,
        handleFormChange, handleSubmit,
        openDeleteDialog, closeDeleteDialog, handleDelete,
    }
}

export default useSanPhamManage