// app/cart/data/mockCartItems.ts

// Cart item types & mock data
export interface ProductItem {
  id: string;
  name: string;
  image: string;
  variation: string;
  variations?: string[];
  price: number;
  originalPrice?: number;
  quantity: number;
  soldOut?: boolean;
}

export interface CartGroup {
  shop: string;
  items: ProductItem[];
}

export const mockCartItems: CartGroup[] = [
  {
    shop: "Gia Dụng Việt !",
    items: [
      {
        id: "1",
        name: "Vòi lavabo, Vòi chậu rửa mặt lavab...",
        image: "/mock/voi.png",
        variation: "Thân trúc 30 cm+dây",
        variations: ["Thân trúc 20 cm", "Thân trúc 30 cm+dây", "Thân trúc 40 cm"],
        price: 335000,
        originalPrice: 580000,
        quantity: 1,
      },
      {
        id: "2",
        name: "Bộ 3 nồi inox đáy từ cao cấp",
        image: "/mock/noi.png",
        variation: "20cm - 24cm - 26cm",
        price: 820000,
        originalPrice: 1050000,
        quantity: 2,
      },
      {
        id: "3",
        name: "Giá treo khăn nhà tắm đa năng",
        image: "/mock/gia.png",
        variation: "Kích thước 40cm",
        price: 195000,
        originalPrice: 260000,
        quantity: 1,
      },
    ],
  },
  {
    shop: "HEMERA JEWELRY",
    items: [
      {
        id: "4",
        name: "Khuyên tai nụ Hemera hạt trai nuôi",
        image: "/mock/khuyen.png",
        variation: "1 đôi, Hồng cam 9 - 9,5mm",
        price: 95000,
        quantity: 1,
        soldOut: true,
      },
      {
        id: "5",
        name: "Lắc tay bạc Hemera ngọc trai tự nhiên",
        image: "/mock/lactay.png",
        variation: "Size M",
        price: 185000,
        originalPrice: 245000,
        quantity: 1,
      },
    ],
  },
  {
    shop: "CỬA HÀNG MỸ PHẨM GREEN",
    items: [
      {
        id: "6",
        name: "Son dưỡng môi không màu Lipice",
        image: "/mock/son.png",
        variation: "Hương bạc hà",
        price: 42000,
        quantity: 3,
      },
      {
        id: "7",
        name: "Kem chống nắng Anessa SPF50",
        image: "/mock/anessa.png",
        variation: "60ml",
        price: 230000,
        originalPrice: 280000,
        quantity: 1,
      },
    ],
  },
];

export const trendingSearches = [
    { id: 1, text: 'iPhone 15', category: 'Điện thoại', count: '8.5K' },
    { id: 2, text: 'Laptop Gaming', category: 'Laptop', count: '6.2K' },
    { id: 3, text: 'Tai nghe không dây', category: 'Âm thanh', count: '5.1K' },
    { id: 4, text: 'Máy tính bảng', category: 'Tablet', count: '4.7K' },
    { id: 5, text: 'Camera an ninh', category: 'Thiết bị thông minh', count: '3.9K' },
];

// Dữ liệu mẫu cho các danh mục phổ biến
export const popularCategories = [
    { id: 1, name: 'Smartphone', image: '/images/demo/3.webp', count: '12K+ sản phẩm' },
    { id: 2, name: 'Laptop', image: '/images/demo/3.webp', count: '8K+ sản phẩm' },
    { id: 3, name: 'Tai nghe', image: '/images/demo/3.webp', count: '5K+ sản phẩm' },
    { id: 4, name: 'Đồng hồ thông minh', image: '/images/demo/3.webp', count: '3K+ sản phẩm' },
    { id: 5, name: 'Máy ảnh', image: '/images/demo/3.webp', count: '2K+ sản phẩm' },
];


// ---------------------
 export interface SubCategory {
  id: string;
  name: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  children: SubCategory[];
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Điện thoại',
    children: [
      { id: 'p1', name: 'iPhone 15 Pro', image: '/images/demo/1.webp' },
      { id: 'p2', name: 'Samsung S24', image: '/images/demo/2.webp' },
    ],
  },
  {
    id: '2',
    name: 'Laptop',
    children: [
      { id: 'p3', name: 'MacBook Pro', image: '/images/demo/3.webp' },
      { id: 'p4', name: 'Dell XPS', image: '/images/demo/4.webp' },
    ],
  },
  {
    id: '3',
    name: 'Phụ kiện',
    children: [
      { id: 'p5', name: 'Tai nghe AirPods', image: '/images/demo/5.webp' },
      { id: 'p6', name: 'Sạc dự phòng', image: '/images/demo/1.webp' },
    ],
  },
];