// Đây là bộ data giả có thể tái sử dụng cho API sau này
export const PRODUCT_DATA = {
  NEW_ARRIVALS: [
    {
      id: "p1",
      name: "PC Gaming Tempest G1 - i5 13400F | RTX 4060 | 16GB RAM",
      slug: "pc-gaming-tempest-g1",
      price: 18500000,
      oldPrice: 21000000,
      discount: 12,
      image: "https://product.hstatic.net/200000722513/product/g1_785d9c7d8a7d4a7d8a7d4a7d8a7d4a7d.png", // Link ảnh nên thay bằng ảnh sp thật
      brand: "TEMPEST",
      category: "PC Gaming",
      isNew: true,
      rating: 5
    },
    {
      id: "p2",
      name: "Laptop Gaming ASUS ROG Strix G16 (2024) - Core i7 | RTX 4070",
      slug: "laptop-asus-rog-strix-g16",
      price: 42990000,
      oldPrice: 45000000,
      discount: 5,
      image: "https://product.hstatic.net/200000722513/product/rog_strix_g16.png",
      brand: "ASUS",
      category: "Laptop Gaming",
      isNew: true,
      rating: 4.8
    },
    {
      id: "p3",
      name: "PC Gaming White Edition - i7 14700K | RTX 4080 Super",
      slug: "pc-gaming-white-edition",
      price: 55000000,
      oldPrice: 60000000,
      discount: 8,
      image: "https://product.hstatic.net/200000722513/product/white_pc.png",
      brand: "CUSTOM",
      category: "PC Gaming",
      isNew: true,
      rating: 5
    },
    {
      id: "p4",
      name: "Laptop MSI Katana 15 - i7 13620H | RTX 4060",
      slug: "msi-katana-15",
      price: 28490000,
      oldPrice: 31000000,
      discount: 10,
      image: "https://product.hstatic.net/200000722513/product/katana_15.png",
      brand: "MSI",
      category: "Laptop Gaming",
      isNew: true,
      rating: 4.5
    },
    {
      id: "p5",
      name: "PC Gaming Entry - i3 12100F | GTX 1650",
      slug: "pc-gaming-entry",
      price: 8900000,
      oldPrice: 10500000,
      discount: 15,
      image: "https://product.hstatic.net/200000722513/product/entry_pc.png",
      brand: "TEMPEST",
      category: "PC Gaming",
      isNew: true,
      rating: 4.2
    },
    {
      id: "p6",
      name: "PC Gaming Entry - i3 12100F | GTX 1650",
      slug: "pc-gaming-entry",
      price: 8900000,
      oldPrice: 10500000,
      discount: 15,
      image: "https://product.hstatic.net/200000722513/product/entry_pc.png",
      brand: "TEMPEST",
      category: "PC Gaming",
      isNew: true,
      rating: 4.2
    },
    {
      id: "p7",
      name: "PC Gaming Entry - i3 12100F | GTX 1650",
      slug: "pc-gaming-entry",
      price: 8900000,
      oldPrice: 10500000,
      discount: 15,
      image: "https://product.hstatic.net/200000722513/product/entry_pc.png",
      brand: "TEMPEST",
      category: "PC Gaming",
      isNew: true,
      rating: 4.2
    },
    {
      id: "p8",
      name: "PC Gaming Entry - i3 12100F | GTX 1650",
      slug: "pc-gaming-entry",
      price: 8900000,
      oldPrice: 10500000,
      discount: 15,
      image: "https://product.hstatic.net/200000722513/product/entry_pc.png",
      brand: "TEMPEST",
      category: "PC Gaming",
      isNew: true,
      rating: 4.2
    },
    {
      id: "p9",
      name: "PC Gaming Entry - i3 12100F | GTX 1650",
      slug: "pc-gaming-entry",
      price: 8900000,
      oldPrice: 10500000,
      discount: 15,
      image: "https://product.hstatic.net/200000722513/product/entry_pc.png",
      brand: "TEMPEST",
      category: "PC Gaming",
      isNew: true,
      rating: 4.2
    },
  ],
  FAVORITES: [
    {
      id: "acc1",
      name: "Chuột Gaming Logitech G502 X Plus Wireless RGB",
      slug: "logitech-g502-x-plus",
      price: 3590000,
      oldPrice: 3890000,
      discount: 8,
      image: "https://product.hstatic.net/200000722513/product/g502x_plus.png",
      brand: "LOGITECH",
      category: "Phụ kiện",
      isBestSeller: true,
      rating: 5
    },
    {
      id: "acc2",
      name: "Bàn phím cơ Razer BlackWidow V4 Pro - Yellow Switch",
      slug: "razer-blackwidow-v4-pro",
      price: 5990000,
      oldPrice: 6500000,
      discount: 10,
      image: "https://product.hstatic.net/200000722513/product/razer_v4_pro.png",
      brand: "RAZER",
      category: "Phụ kiện",
      isBestSeller: true,
      rating: 4.9
    },
    {
      id: "acc3",
      name: "Tai nghe Gaming Corsair HS80 RGB Wireless",
      slug: "corsair-hs80-rgb",
      price: 3290000,
      oldPrice: 3600000,
      discount: 9,
      image: "https://product.hstatic.net/200000722513/product/hs80_corsair.png",
      brand: "CORSAIR",
      category: "Phụ kiện",
      isBestSeller: true,
      rating: 4.7
    },
    {
      id: "acc4",
      name: "Màn hình ASUS ROG Swift OLED PG27AQDM - 2K 240Hz",
      slug: "asus-rog-swift-oled",
      price: 24900000,
      oldPrice: 27000000,
      discount: 7,
      image: "https://product.hstatic.net/200000722513/product/pg27aqdm.png",
      brand: "ASUS",
      category: "Màn hình",
      isBestSeller: true,
      rating: 5
    },
    {
      id: "acc5",
      name: "Ghế Gaming Secretlab TITAN Evo - Series 2024",
      slug: "secretlab-titan-evo",
      price: 12500000,
      oldPrice: 14000000,
      discount: 11,
      image: "https://product.hstatic.net/200000722513/product/titan_evo.png",
      brand: "SECRETLAB",
      category: "Ghế Gaming",
      isBestSeller: true,
      rating: 4.9
    }
  ]
  
};

