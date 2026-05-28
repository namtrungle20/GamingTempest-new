import { useState, useEffect } from 'react'
import { useAuth } from '@/hook/provider/AuthContext'
import apiConfig from '@/config/apiConfig'
import { API } from '@/constants/apiConstants'
import { toast } from 'sonner'

const useProfile = () => {
    const { user } = useAuth()
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
            await apiConfig.put(API.USERS.UPDATE, {
                name: form.name || undefined,
                email: form.email || undefined,
                sdt: form.sdt || undefined,
                diachi: form.diachi || undefined,
            })
            toast.success('Cập nhật thành công')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi cập nhật thông tin')
        } finally {
            setSaving(false)
        }
    }

    return { user, form, saving, handleChange, handleSave }
}

export default useProfile