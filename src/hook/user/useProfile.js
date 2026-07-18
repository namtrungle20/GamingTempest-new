import { useState, useEffect } from 'react'
import { useAuth } from '@/hook/provider/AuthContext'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'
import { toast } from 'sonner'
import { NguoiDungService } from '@/services/user.service'

const useProfile = () => {
    const { user, updateUser } = useAuth()
    const [form, setForm] = useState({ name: '', email: '', sdt: '', diachi: '' })
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                sdt: user.sdt || '',
                diachi: user.diachi || '',
            })
        }
    }, [user])

    const handleChange = (field) => (e) =>
        setForm(p => ({ ...p, [field]: e.target.value }))

    const handleSave = async () => {
        setSaving(true)
        try {
            const result = await NguoiDungService.update(user.id, {  // ← dùng service + truyền id
                name: form.name || undefined,
                email: form.email || undefined,
                sdt: form.sdt || undefined,
                diachi: form.diachi || undefined,
            })
            if (result.success) {
                updateUser(result.raw.data)
                toast.success('Cập nhật thành công')
            } else {
                toast.error(result.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi cập nhật thông tin')
        } finally {
            setSaving(false)
        }
    }
    return { user, form, saving, handleChange, handleSave }
}
export default useProfile