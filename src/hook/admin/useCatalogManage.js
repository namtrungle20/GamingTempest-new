import { useState, useCallback, useEffect, useRef } from 'react'


const INITIAL_FORM = { name: '', image: null }

const useCatalogManage = (service, ModelClass) => {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editTarget, setEditTarget] = useState(null)
    const [form, setForm] = useState(INITIAL_FORM)
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' })
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    const notify = useCallback((message, severity = 'success') =>
        setSnackbar({ open: true, message, severity }), [])

    const closeSnackbar = useCallback(() =>
        setSnackbar(prev => ({ ...prev, open: false })), [])

    const fetchItems = useCallback(async () => {
        setLoading(true)
        const result = await service.getAll({ page, search })
        if (result.success) {
            const data = result.raw.data || []
            setItems(ModelClass ? data.map(d => new ModelClass(d)) : data) // ✅ map qua model
            setTotal(result.raw.total || 0)
        } else {
            notify(result.message, 'error')
        }
        setLoading(false)
    }, [page, search, service, ModelClass, notify])

    useEffect(() => { fetchItems() }, [fetchItems])

    const openCreate = useCallback(() => {
        setEditTarget(null)
        setForm(INITIAL_FORM)
        setModalOpen(true)
    }, [])

    const openEdit = useCallback((item) => {
        setEditTarget(item)
        setForm({ name: item.name || '', image: null })
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
            ? await service.update(editTarget.id, formData) // ✅ dùng .id từ model
            : await service.create(formData)

        if (result.success) {
            notify(editTarget ? 'Cập nhật thành công' : 'Thêm thành công')
            closeModal()
            fetchItems()
        } else {
            notify(result.message, 'error')
        }
    }, [form, editTarget, service, notify, closeModal, fetchItems])

    const openDeleteDialog = useCallback((id, name) => {
        setDeleteDialog({ open: true, id, name })
    }, [])

    const closeDeleteDialog = useCallback(() => {
        setDeleteDialog({ open: false, id: null, name: '' })
    }, [])

    const handleDelete = useCallback(async () => {
        const result = await service.remove(deleteDialog.id)
        if (result.success) {
            notify('Xóa thành công')
            closeDeleteDialog()
            fetchItems()
        } else {
            notify(result.message, 'error')
        }
    }, [deleteDialog.id, service, notify, closeDeleteDialog, fetchItems])

    return {
        items, loading, total, page, search,
        modalOpen, editTarget, form, deleteDialog, snackbar,
        setPage, setSearch, notify, closeSnackbar,
        openCreate, openEdit, closeModal,
        handleFormChange, handleSubmit,
        openDeleteDialog, closeDeleteDialog, handleDelete,
    }
}

export default useCatalogManage