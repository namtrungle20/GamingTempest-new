class HinhAnh {
    constructor(data = {}) {
        this.id = data.id;
        this.sanpham_id = data.sanpham_id;
        this.image_url = data.image_url;
        this.is_primary = data.la_anh_dai_dien === true;
        this.type = data.type || 'image';
    }

    get url() {
        return this.image_url;
    }

    get isVideo() {
        return this.type === 'video';
    }

    get isValid() {
        return !!this.image_url && this.image_url.startsWith('http');
    }

    get thumbnail() {
        if (!this.isVideo) return this.image_url;
        const match = this.image_url?.match(/embed\/([^?]+)/);
        return match
            ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
            : this.image_url;
    }
}

export default HinhAnh;