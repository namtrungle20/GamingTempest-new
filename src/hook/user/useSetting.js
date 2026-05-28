import { useState } from 'react'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'
import { toast } from 'sonner'

const useChangePassword = () => {
    const [form, setForm] = useState({ matKhauCu: '', matKhauMoi: '', xacNhan: '' })
    const [show, setShow] = useState({ cu: false, moi: false, xacNhan: false })
    const [saving, setSaving] = useState(false)

    const handleChange = (field) => (e) =>
        setForm(p => ({ ...p, [field]: e.target.value }))

    const toggleShow = (field) =>
        setShow(p => ({ ...p, [field]: !p[field] }))

    const handleSave = async () => {
        if (form.matKhauMoi !== form.xacNhan) {
            toast.error('Mật khẩu xác nhận không khớp')
            return
        }
        if (form.matKhauMoi.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự')
            return
        }
        setSaving(true)
        try {
            await apiConfig.put(API.USERS.CHANGE_PASSWORD, {
                matKhauCu: form.matKhauCu,
                matKhauMoi: form.matKhauMoi,
            })
            toast.success('Đổi mật khẩu thành công')
            setForm({ matKhauCu: '', matKhauMoi: '', xacNhan: '' })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi đổi mật khẩu')
        } finally {
            setSaving(false)
        }
    }

    return { form, show, saving, handleChange, toggleShow, handleSave }
}

export default useChangePassword