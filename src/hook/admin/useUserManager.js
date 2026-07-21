import { useState, useEffect, useCallback, useRef, useMemo, useTransition } from 'react'
import apiConfig from '@/config/apiConfig'
import User from '@/models/User'
import { API } from '@/constants/apiConstants'

const useUserManager = () => {
    // ══════════════════════════════════════════════════════════
    // STATE
    // ══════════════════════════════════════════════════════════
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    // Pagination
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [total, setTotal] = useState(0)

    // ✅ searchInput + debounce đã chuyển vào FilterBar
    // Hook chỉ giữ searchTerm (giá trị đã debounce, dùng để gọi API)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [lockFilter, setLockFilter] = useState('')

    const abortControllerRef = useRef(null)

    // Edit Modal
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)

    // Delete Confirm
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [deleteUserId, setDeleteUserId] = useState(null)

    // useTransition: filter/page update không block UI
    const [isFiltering, startFilterTransition] = useTransition()

    // ══════════════════════════════════════════════════════════
    // HELPERS
    // ══════════════════════════════════════════════════════════
    const notify = useCallback((message, severity = 'success') => {
        setSnackbar({ open: true, message, severity })
    }, [])

    const closeSnackbar = useCallback(() => {
        setSnackbar(prev => ({ ...prev, open: false }))
    }, [])

    // ══════════════════════════════════════════════════════════
    // FETCH USERS
    // ══════════════════════════════════════════════════════════
    const fetchUsers = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        setLoading(true)
        try {
            const filter = {}
            if (roleFilter) filter.vaitro = parseInt(roleFilter)
            if (lockFilter !== '') filter.trangthai = parseInt(lockFilter)

            const res = await apiConfig.post(API.USERS.LIST, {
                pagination: { page, perPage: rowsPerPage },
                sort: { field: 'ngayvao', order: 'DESC' },
                filter,
                search: searchTerm || '',
            }, { signal })

            if (!signal.aborted) {
                setUsers((res.data.data || []).map(u => new User(u)))
                setTotal(res.data.total || 0)
            }
        } catch (err) {
            if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                notify(err.response?.data?.message || 'Lỗi tải danh sách người dùng', 'error')
            }
        } finally {
            if (!abortControllerRef.current?.signal.aborted) {
                setLoading(false)
            }
        }
    }, [page, rowsPerPage, searchTerm, roleFilter, lockFilter, notify])

    useEffect(() => {
        fetchUsers()
        return () => abortControllerRef.current?.abort()
    }, [fetchUsers])

    // ══════════════════════════════════════════════════════════
    // UPDATE USER
    // ══════════════════════════════════════════════════════════
    const handleUpdateUser = useCallback(async (userData) => {
        try {
            await apiConfig.put(API.USERS.UPDATE(userData.id), userData)
            notify('Cập nhật người dùng thành công')
            setEditModalOpen(false)
            setEditingUser(null)
            fetchUsers()
        } catch (err) {
            notify(err.response?.data?.message || 'Lỗi cập nhật người dùng', 'error')
        }
    }, [notify, fetchUsers])

    // ══════════════════════════════════════════════════════════
    // DELETE USER
    // ══════════════════════════════════════════════════════════
    const handleDeleteClick = useCallback((userId) => {
        setDeleteUserId(userId)
        setConfirmOpen(true)
    }, [])

    const handleConfirmDelete = useCallback(async () => {
        try {
            await apiConfig.delete(API.USERS.DELETE(deleteUserId))
            notify('Xóa người dùng thành công')
            if (users.length === 1 && page > 1) {
                setPage(prev => prev - 1)
            } else {
                fetchUsers()
            }
        } catch (err) {
            notify(err.response?.data?.message || 'Lỗi xóa người dùng', 'error')
        } finally {
            setConfirmOpen(false)
            setDeleteUserId(null)
        }
    }, [deleteUserId, users.length, page, notify, fetchUsers])

    const handleCancelDelete = useCallback(() => {
        setConfirmOpen(false)
        setDeleteUserId(null)
    }, [])

    // ══════════════════════════════════════════════════════════
    // EDIT MODAL
    // ══════════════════════════════════════════════════════════
    const handleEditClick = useCallback((user) => {
        setEditingUser(user)
        setEditModalOpen(true)
    }, [])

    const handleCloseEditModal = useCallback(() => {
        setEditModalOpen(false)
        setEditingUser(null)
    }, [])

    // ══════════════════════════════════════════════════════════
    // SEARCH & FILTER
    // ══════════════════════════════════════════════════════════

    // ✅ handleSearchChange nhận giá trị đã debounce từ FilterBar
    // Không cần setSearchInput nữa — FilterBar tự quản lý input display
    const handleSearchChange = useCallback((debouncedValue) => {
        startFilterTransition(() => {
            setSearchTerm(debouncedValue)
            setPage(1)
        })
    }, [])

    const handleRoleFilterChange = useCallback((value) => {
        startFilterTransition(() => {
            setRoleFilter(value)
            setPage(1)
        })
    }, [])

    const handleLockFilterChange = useCallback((value) => {
        startFilterTransition(() => {
            setLockFilter(value)
            setPage(1)
        })
    }, [])

    // ✅ trả về callback resetSearch để FilterBar có thể clear input của nó
    const [resetSearchKey, setResetSearchKey] = useState(0)
    const handleClearFilters = useCallback(() => {
        startFilterTransition(() => {
            setSearchTerm('')
            setRoleFilter('')
            setLockFilter('')
            setPage(1)
            setResetSearchKey(k => k + 1) // trigger FilterBar reset input
        })
    }, [])

    // ══════════════════════════════════════════════════════════
    // PAGINATION
    // ══════════════════════════════════════════════════════════
    const handlePageChange = useCallback((newPage) => {
        startFilterTransition(() => setPage(newPage))
    }, [])

    const handleRowsPerPageChange = useCallback((newRowsPerPage) => {
        startFilterTransition(() => {
            setRowsPerPage(newRowsPerPage)
            setPage(1)
        })
    }, [])

    // ══════════════════════════════════════════════════════════
    // MEMOIZED VALUES
    // ══════════════════════════════════════════════════════════
    const hasActiveFilters = useMemo(() => {
        return !!(searchTerm || roleFilter || lockFilter !== '')
    }, [searchTerm, roleFilter, lockFilter])

    return {
        users, loading, total, isFiltering,
        page, rowsPerPage, handlePageChange, handleRowsPerPageChange,
        searchTerm, roleFilter, lockFilter,
        resetSearchKey, hasActiveFilters,
        handleSearchChange, handleRoleFilterChange,
        handleLockFilterChange, handleClearFilters,
        handleEditClick, handleUpdateUser, handleDeleteClick,
        editModalOpen, editingUser, handleCloseEditModal,
        confirmOpen, handleConfirmDelete, handleCancelDelete,
        snackbar, closeSnackbar,
        refetch: fetchUsers,
    }
}

export default useUserManager