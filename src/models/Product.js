// src/models/Product.js
export default class Product {
    constructor(data = {}) {
        this.id = data.sanpham_id
        this.name = data.name || ''
        this.mota = data.mota || ''
        this.thongSo = data.thong_so || {}
        this.gia = Number(data.gia) || 0
        this.soluong = data.soluong || 0
        this.loai_id = data.loai_id
        this.thuonghieu_id = data.thuonghieu_id
        this.loai = data.LoaiSanPham?.name || ''
        this.thuonghieu = data.ThuongHieu?.name || ''
        this.createdAt = data.createdAt
    }

    get price() {
        return this.gia.toLocaleString('vi-VN') + '₫'
    }

    get imageUrl() {
        if (!this.image) return null
        if (this.image.startsWith('http')) return this.image
        return `${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${this.image}`
    }

    get inStock() {
        return this.soluong > 0
    }

    get stockStatus() {
        if (this.soluong > 10) return 'success'
        if (this.soluong > 0) return 'warning'
        return 'error'
    }
}