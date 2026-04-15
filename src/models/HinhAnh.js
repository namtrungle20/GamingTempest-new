class HinhAnh {
    constructor(data = {}) {
        this.id = data.id;
        this.sanpham_id = data.sanpham_id;
        this.image_url = data.image_url;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    get url() {
        return this.image_url;
    }
    get isValid() {
        return !!this.image_url && this.image_url.startsWith('http');
    }
}

export default HinhAnh;