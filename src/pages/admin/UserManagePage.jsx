import { memo, useState, useEffect, useRef } from 'react'
import * as Mui from '@mui/material'
import * as Icon from '@mui/icons-material'
import useUserManager from '@/hook/admin/useUserManager'
import EditUserModal from '@/components/admin/user/EditUserModal'
import ConfirmDeleteDialog from '@/components/admin/user/ConfirmDeleteDialog'
import { ROLE_LABEL, ROLE_COLOR, LOCK_LABEL, LOCK_COLOR, LOCK_STATUS, ROLE_OPTIONS, LOCK_OPTIONS } from '@/constants/UserConstants'

// ══════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════

const UserTableRow = memo(({ user, onEdit, onDelete }) => (
    <Mui.TableRow hover>
        <Mui.TableCell>
            <Mui.Box display="flex" alignItems="center" gap={1.5}>
                <Mui.Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                    {user.displayName[0].toUpperCase()}
                </Mui.Avatar>
                <Mui.Box>
                    <Mui.Typography variant="body2" fontWeight={600}>
                        {user.email || user.sdt}
                    </Mui.Typography>
                    {user.email && user.sdt && (
                        <Mui.Typography variant="caption" color="text.secondary">
                            {user.sdt}
                        </Mui.Typography>
                    )}
                </Mui.Box>
            </Mui.Box>
        </Mui.TableCell>
        <Mui.TableCell>
            <Mui.Chip
                label={ROLE_LABEL[user.vaitro] ?? user.vaitro}
                color={ROLE_COLOR[user.vaitro]}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
            />
        </Mui.TableCell>
        <Mui.TableCell>
            <Mui.Chip
                label={LOCK_LABEL[user.trangthai] ?? 'Không xác định'}
                color={LOCK_COLOR[user.trangthai] ?? 'default'}
                size="small"
                sx={{ fontWeight: 700, fontSize: '0.7rem' }}
            />
        </Mui.TableCell>
        <Mui.TableCell align="right">
            <Mui.IconButton size="small" onClick={() => onEdit(user)} color="primary">
                <Icon.Edit fontSize="small" />
            </Mui.IconButton>
            <Mui.IconButton size="small" onClick={() => onDelete(user.id)} color="error">
                <Icon.Delete fontSize="small" />
            </Mui.IconButton>
        </Mui.TableCell>
    </Mui.TableRow>
))

const TableSkeleton = memo(({ rows = 5 }) => (
    <>
        {[...Array(rows)].map((_, i) => (
            <Mui.TableRow key={i}>
                <Mui.TableCell><Mui.Skeleton height={40} /></Mui.TableCell>
                <Mui.TableCell><Mui.Skeleton width={80} /></Mui.TableCell>
                <Mui.TableCell><Mui.Skeleton width={80} /></Mui.TableCell>
                <Mui.TableCell align="right"><Mui.Skeleton width={80} /></Mui.TableCell>
            </Mui.TableRow>
        ))}
    </>
))

// ✅ FIX INP: FilterBar tự quản lý inputValue + debounce
// Gõ phím chỉ re-render FilterBar — hook và table hoàn toàn không bị động tới
const FilterBar = memo(({ roleFilter, lockFilter, hasActiveFilters, resetSearchKey, onSearchChange, onRoleChange, onLockChange, onClear }) => {
    const [inputValue, setInputValue] = useState('')
    const debounceRef = useRef(null)

    // Reset input khi hook yêu cầu (sau clearFilters)
    useEffect(() => {
        setInputValue('')
    }, [resetSearchKey])

    const handleInputChange = (e) => {
        const value = e.target.value
        setInputValue(value) // update display ngay lập tức — không qua hook

        // Chỉ notify hook sau 400ms — không gây re-render page khi gõ
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            onSearchChange(value)
        }, 400)
    }

    useEffect(() => () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
    }, [])

    return (
        <Mui.Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Mui.Grid container spacing={2} alignItems="center">
                <Mui.Grid size={{ xs: 12, md: 4 }}>
                    <Mui.TextField
                        fullWidth
                        size="small"
                        placeholder="Tìm kiếm theo email hoặc SĐT..."
                        value={inputValue}
                        onChange={handleInputChange}
                        InputProps={{
                            startAdornment: <Icon.Search sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                    />
                </Mui.Grid>
                <Mui.Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Mui.FormControl fullWidth size="small">
                        <Mui.InputLabel>Vai trò</Mui.InputLabel>
                        <Mui.Select value={roleFilter} label="Vai trò" onChange={(e) => onRoleChange(e.target.value)}>
                            <Mui.MenuItem value="">Tất cả</Mui.MenuItem>
                            {ROLE_OPTIONS.map(opt => (
                                <Mui.MenuItem key={opt.value} value={opt.value}>{opt.label}</Mui.MenuItem>
                            ))}
                        </Mui.Select>
                    </Mui.FormControl>
                </Mui.Grid>
                <Mui.Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Mui.FormControl fullWidth size="small">
                        <Mui.InputLabel>Trạng thái</Mui.InputLabel>
                        <Mui.Select value={lockFilter} label="Trạng thái" onChange={(e) => onLockChange(e.target.value)}>
                            <Mui.MenuItem value="">Tất cả</Mui.MenuItem>
                            {LOCK_OPTIONS.map(opt => (
                                <Mui.MenuItem key={opt.value} value={opt.value}>{opt.label}</Mui.MenuItem>
                            ))}
                        </Mui.Select>
                    </Mui.FormControl>
                </Mui.Grid>
                <Mui.Grid size={{ xs: 12, md: 2 }}>
                    <Mui.Button
                        fullWidth
                        variant="outlined"
                        disabled={!hasActiveFilters && !inputValue}
                        onClick={onClear}
                        startIcon={<Icon.FilterAltOff />}
                    >
                        Xóa lọc
                    </Mui.Button>
                </Mui.Grid>
            </Mui.Grid>
        </Mui.Paper>
    )
})

// ══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════

const UserManagePage = () => {
    const {
        users, loading, total,
        page, rowsPerPage, handlePageChange, handleRowsPerPageChange,
        roleFilter, lockFilter, hasActiveFilters, resetSearchKey,
        handleSearchChange, handleRoleFilterChange, handleLockFilterChange, handleClearFilters,
        handleEditClick, handleUpdateUser, handleDeleteClick,
        editModalOpen, editingUser, handleCloseEditModal,
        confirmOpen, handleConfirmDelete, handleCancelDelete,
        snackbar, closeSnackbar,
    } = useUserManager()

    return (
        <Mui.Box>
            {/* Header */}
            <Mui.Box mb={4}>
                <Mui.Typography variant="h4" fontWeight={900} color="text.primary">
                    Quản lý người dùng
                </Mui.Typography>
                <Mui.Typography variant="body2" color="text.secondary" mt={0.5}>
                    Quản lý thông tin và quyền hạn của người dùng trong hệ thống
                </Mui.Typography>
            </Mui.Box>

            <FilterBar
                roleFilter={roleFilter}
                lockFilter={lockFilter}
                hasActiveFilters={hasActiveFilters}
                resetSearchKey={resetSearchKey}
                onSearchChange={handleSearchChange}
                onRoleChange={handleRoleFilterChange}
                onLockChange={handleLockFilterChange}
                onClear={handleClearFilters}
            />

            {/* Stats */}
            <Mui.Box display="flex" gap={2} mb={3}>
                <Mui.Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, flex: 1 }}>
                    <Mui.Typography variant="caption" color="text.secondary" fontWeight={700}>
                        TỔNG SỐ NGƯỜI DÙNG
                    </Mui.Typography>
                    <Mui.Typography variant="h5" fontWeight={900} color="primary.main" mt={0.5}>
                        {loading ? <Mui.Skeleton width={60} /> : total}
                    </Mui.Typography>
                </Mui.Paper>
                <Mui.Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, flex: 1 }}>
                    <Mui.Typography variant="caption" color="text.secondary" fontWeight={700}>
                        KẾT QUẢ LỌC
                    </Mui.Typography>
                    <Mui.Typography variant="h5" fontWeight={900} color="text.primary" mt={0.5}>
                        {loading ? <Mui.Skeleton width={60} /> : users.length}
                    </Mui.Typography>
                </Mui.Paper>
            </Mui.Box>

            {/* Table */}
            <Mui.Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Mui.TableContainer>
                    <Mui.Table>
                        <Mui.TableHead>
                            <Mui.TableRow>
                                <Mui.TableCell sx={{ fontWeight: 700, bgcolor: 'background.default' }}>Người dùng</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700, bgcolor: 'background.default' }}>Vai trò</Mui.TableCell>
                                <Mui.TableCell sx={{ fontWeight: 700, bgcolor: 'background.default' }}>Trạng thái</Mui.TableCell>
                                <Mui.TableCell align="right" sx={{ fontWeight: 700, bgcolor: 'background.default' }}>Thao tác</Mui.TableCell>
                            </Mui.TableRow>
                        </Mui.TableHead>
                        <Mui.TableBody>
                            {loading ? (
                                <TableSkeleton rows={rowsPerPage} />
                            ) : users.length === 0 ? (
                                <Mui.TableRow>
                                    <Mui.TableCell colSpan={4}>
                                        <Mui.Box py={8} textAlign="center">
                                            <Icon.SearchOff sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                                            <Mui.Typography variant="h6" color="text.secondary" fontWeight={600}>
                                                Không tìm thấy người dùng
                                            </Mui.Typography>
                                            <Mui.Typography variant="body2" color="text.secondary" mt={1}>
                                                Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                                            </Mui.Typography>
                                        </Mui.Box>
                                    </Mui.TableCell>
                                </Mui.TableRow>
                            ) : (
                                users.map(user => (
                                    <UserTableRow
                                        key={user.id}
                                        user={user}
                                        onEdit={handleEditClick}
                                        onDelete={handleDeleteClick}
                                    />
                                ))
                            )}
                        </Mui.TableBody>
                    </Mui.Table>
                </Mui.TableContainer>

                {!loading && users.length > 0 && (
                    <Mui.Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1.5} borderTop="1px solid" borderColor="divider">
                        <Mui.Typography variant="body2" color="text.secondary">
                            Hiển thị {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, total)} trong tổng số {total}
                        </Mui.Typography>
                        <Mui.Box display="flex" gap={1} alignItems="center">
                            <Mui.Select
                                size="small"
                                value={rowsPerPage}
                                onChange={(e) => handleRowsPerPageChange(e.target.value)}
                                sx={{ minWidth: 80 }}
                            >
                                <Mui.MenuItem value={5}>5</Mui.MenuItem>
                                <Mui.MenuItem value={10}>10</Mui.MenuItem>
                                <Mui.MenuItem value={25}>25</Mui.MenuItem>
                                <Mui.MenuItem value={50}>50</Mui.MenuItem>
                            </Mui.Select>
                            <Mui.Pagination
                                count={Math.ceil(total / rowsPerPage)}
                                page={page}
                                onChange={(_, value) => handlePageChange(value)}
                                color="primary"
                                shape="rounded"
                            />
                        </Mui.Box>
                    </Mui.Box>
                )}
            </Mui.Paper>

            <EditUserModal
                open={editModalOpen}
                user={editingUser}
                onClose={handleCloseEditModal}
                onSave={handleUpdateUser}
            />
            <ConfirmDeleteDialog
                open={confirmOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Xác nhận xóa người dùng"
                message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
            />
            <Mui.Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Mui.Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Mui.Alert>
            </Mui.Snackbar>
        </Mui.Box>
    )
}

export default UserManagePage