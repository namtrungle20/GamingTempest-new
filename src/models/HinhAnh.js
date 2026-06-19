class HinhAnh {
    constructor(data = {}) {
        this.id = data.id;
        this.sanpham_id = data.sanpham_id;
        this.image_url = data.image_url;
        this.is_primary = data.la_anh_dai_dien === true;
    }

    get url() {
        return this.image_url;
    }
    get isValid() {
        return !!this.image_url && this.image_url.startsWith('http');
    }
}

export default HinhAnh;