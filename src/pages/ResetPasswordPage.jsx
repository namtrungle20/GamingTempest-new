import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ResetPasswordPage = () => {
    const navigate = useNavigate()
    useEffect(() => { navigate('/forgot-password', { replace: true }) }, [])
    return null
}

export default ResetPasswordPage