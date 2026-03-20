import { useContext } from 'react'
import { AuthContext } from '@/hook/provider/AuthContext'

const useAuth = () => useContext(AuthContext)
export default useAuth