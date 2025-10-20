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



export const cartItems = [
    {
      id: 1,
      name: '[BH Trọn Đời] Dây Chuyền Bạc S9...',
      price: '395.000',
      image: '/images/demo/1.webp', // Replace with actual image path
    },
    {
      id: 2,
      name: 'Tinh Dầu Xịt Thơm White Tea & Fig ...',
      price: '49.000',
      image: '/images/demo/2.webp', // Using a different placeholder image
    },
     {
      id: 3,
      name: 'Đèn Treo Màn Hình Máy Tính Lym...',
      price: '339.000',
      image: '/images/demo/3.webp', // Using a different placeholder image
    },
     {
      id: 4,
      name: '[HÀNG IN ĐẸP] Móc khóa yêu nướ...',
      price: '19.000',
      image: '/images/demo/4.webp', // Using a different placeholder image
    },
     {
      id: 5,
      name: 'Giá đỡ Laptop chân xoay 360 độ, ...',
      price: '219.000',
      image: '/images/demo/5.webp', // Using a different placeholder image
    },
  ];