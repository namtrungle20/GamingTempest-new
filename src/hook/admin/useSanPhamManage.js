import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/product.service.js'
import Product from '@/models/Product'
import { uploadService } from '@/services/upload.service';

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
            image: null,
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
    // const handleSubmit = useCallback(async () => {
    //     const formData = new FormData()
    //     Object.entries(form).forEach(([key, value]) => {
    //         if (['gia', 'soluong', 'loai_id', 'thuonghieu_id'].includes(key)) {
    //             formData.append(key, Number(value))
    //         } else {
    //             formData.append(key, value)
    //         }
    //     })

    //     const result = editTarget
    //         ? await productService.update(editTarget.sanpham_id, formData)
    //         : await productService.create(formData)

    //     if (result.success) {
    //         notify(editTarget ? 'Cập nhật thành công' : 'Thêm sản phẩm thành công')
    //         closeModal()
    //         fetchSanPhams()
    //     } else {
    //         notify(result.message, 'error')
    //     }
    // }, [form, editTarget, notify, closeModal, fetchSanPhams])

    const handleSubmit = useCallback(async () => {
        // 1. Xử lý upload ảnh nếu có file mới
        let imageUrl = editTarget?.image // Giữ ảnh cũ nếu không thay đổi

        if (form.image && form.image instanceof File) {
            const uploadResult = await uploadService.uploadImage(form.image)
            if (!uploadResult.success) {
                notify(uploadResult.message, 'error')
                return
            }
            imageUrl = uploadResult.url
        }

        // 2. Tạo payload cho API sản phẩm (không gửi file ảnh trực tiếp)
        const payload = {
            name: form.name,
            mota: form.mota,
            gia: Number(form.gia),
            soluong: Number(form.soluong),
            loai_id: Number(form.loai_id),
            thuonghieu_id: Number(form.thuonghieu_id),
            image: imageUrl // Gửi URL ảnh
        }

        const productId = editTarget?.sanpham_id || editTarget?.id

        if (!productId && editTarget) {
            notify('Không tìm thấy ID sản phẩm', 'error')
            return
        }

        // 3. Gọi API sản phẩm
        const result = editTarget
            ? await productService.update(productId, payload)  // ← dùng productId, không dùng editTarget.sanpham_id
            : await productService.create(payload)

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
        fetchMeta, modalOpen, editTarget, form, deleteDialog, snackbar,
        setPage, setSearch, notify, closeSnackbar,
        openCreate, openEdit, closeModal,
        handleFormChange, handleSubmit,
        openDeleteDialog, closeDeleteDialog, handleDelete,
    }
}

export default useSanPhamManage