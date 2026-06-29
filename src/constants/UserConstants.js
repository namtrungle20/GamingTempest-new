export const USER_ROLE = {
    CUSTOMER: 0,
    ADMIN: 1,
}

export const ROLE_LABEL = {
    [USER_ROLE.ADMIN]: 'Admin',
    [USER_ROLE.CUSTOMER]: 'Khách hàng',
}

export const ROLE_COLOR = {
    [USER_ROLE.ADMIN]: 'error',
    [USER_ROLE.CUSTOMER]: 'default',
}

export const ROLE_OPTIONS = [
    { value: USER_ROLE.ADMIN, label: ROLE_LABEL[USER_ROLE.ADMIN] },
    { value: USER_ROLE.CUSTOMER, label: ROLE_LABEL[USER_ROLE.CUSTOMER] },
]

export const LOCK_STATUS = {
    ACTIVE: 0,
    LOCKED: 1,
    DELETE: 2
}

export const LOCK_LABEL = {
    [LOCK_STATUS.ACTIVE]: 'Hoạt động',
    [LOCK_STATUS.LOCKED]: 'Bị khóa',
    [LOCK_STATUS.DELETE]: 'Đã Xóa',
}

export const LOCK_COLOR = {
    [LOCK_STATUS.ACTIVE]: 'success',
    [LOCK_STATUS.LOCKED]: 'warning',
    [LOCK_STATUS.DELETE]: 'warning',
}

export const LOCK_OPTIONS = [
    { value: LOCK_STATUS.ACTIVE, label: LOCK_LABEL[LOCK_STATUS.ACTIVE] },
    { value: LOCK_STATUS.LOCKED, label: LOCK_LABEL[LOCK_STATUS.LOCKED] },
    { value: LOCK_STATUS.DELETE, label: LOCK_LABEL[LOCK_STATUS.DELETE] },
]