import useCatalogManage from './useCatalogManage'
import { brandService } from '@/services/brand.service'
import Brand from '@/models/Brand'

const useThuongHieuManage = () => {
    const initialForm = { name: '', image: null }
    return useCatalogManage(brandService, Brand, initialForm)
}

export default useThuongHieuManage