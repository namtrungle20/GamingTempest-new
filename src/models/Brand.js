export default class Brand {
    constructor(data = {}) {
        this.id = data.thuonghieu_id
        this.name = data.name || ''
        this.image = data.image || null
    }

    get imageUrl() {
        if (!this.image) return null
        if (this.image.startsWith('http')) return this.image
        return `${import.meta.env.VITE_BACKEND_BASE_URL}/uploads/${this.image}`
    }
}