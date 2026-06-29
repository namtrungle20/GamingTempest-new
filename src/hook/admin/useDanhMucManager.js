import useCatalogManage from './useCatalogManage'
import { danhmucService } from '@/services/danhmuc.service'
import DanhMuc from '@/models/DanhMuc'

const useDanhMucManage = () => {
  const initialForm = { ten: '', image: null }
  return useCatalogManage(danhmucService, DanhMuc, initialForm)
}

export default useDanhMucManage