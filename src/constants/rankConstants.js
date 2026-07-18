export const HANG_CONFIG = {
    0: {
        label: 'Đồng',
        color: '#B87333',
        bgColor: 'rgba(184,115,51,0.12)',
        icon: 'MilitaryTech',
        giamShip: 0,
        dieuKien: 0,
    },
    1: {
        label: 'Bạc',
        color: '#9E9E9E',
        bgColor: 'rgba(158,158,158,0.14)',
        icon: 'WorkspacePremium',
        giamShip: 5,
        dieuKien: 5_000_000,
    },
    2: {
        label: 'Vàng',
        color: '#D4AF37',
        bgColor: 'rgba(212,175,55,0.14)',
        icon: 'EmojiEvents',
        giamShip: 50,
        dieuKien: 20_000_000,
    },
    3: {
        label: 'Kim Cương',
        color: '#4FC3F7',
        bgColor: 'rgba(79,195,247,0.14)',
        icon: 'Diamond',
        giamShip: 100,
        dieuKien: 50_000_000,
    },
};

export const getHangConfig = (hang) => HANG_CONFIG[hang] ?? HANG_CONFIG[0];

// Format tiền VNĐ ngắn gọn (5.000.000 → 5tr)
export const formatTienNgan = (soTien) => {
    if (soTien >= 1_000_000) return `${(soTien / 1_000_000).toLocaleString('vi-VN')}tr`
    if (soTien >= 1_000) return `${(soTien / 1_000).toLocaleString('vi-VN')}k`
    return soTien.toLocaleString('vi-VN')
}