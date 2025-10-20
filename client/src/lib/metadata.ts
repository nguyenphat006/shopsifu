// lib/metadata.ts
export const metadataConfig = {
    '/sign-in': {
      title: 'Đăng nhập tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Đăng nhập tài khoản để tiếp tục mua sắm cùng Shopsifu.',
    },
    '/sign-up': {
      title: 'Đăng ký tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Tạo tài khoản mới và bắt đầu mua sắm ngay.',
    },
    '/forgot-password': {
      title: 'Quên mật khẩu tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Đặt lại mật khẩu một cách nhanh chóng.',
    },
    '/reset-password': {
      title: 'Đặt lại mật khẩu tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Nhập mật khẩu mới để khôi phục tài khoản của bạn.',
    },
    '/verify-code': {
      title: 'Xác minh mã OTP tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xác minh tài khoản của bạn bằng mã OTP.',
    },
    '/verify-2fa': {
      title: 'Xác minh mã OTP tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xác minh tài khoản của bạn bằng mã OTP.',
    },
    '/user/dashboard': {
      title: 'Trang tổng quan - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xem tổng quan về hoạt động mua sắm của bạn.',
    },
    '/user/orders': {
      title: 'Đơn hàng của tôi - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xem và quản lý các đơn hàng đã đặt.',
    },
    '/user/profile': {
      title: 'Thông tin tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xem và cập nhật thông tin cá nhân của bạn.',  
    },
    '/cart': {
      title: 'Giỏ hàng - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xem và quản lý các sản phẩm trong giỏ hàng của bạn.',
    },
    // --------------------------------SELLER------------------------------------ //
    '/seller/sign-up': {
      title: 'Đăng ký tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Tạo tài khoản mới và bắt đầu mua sắm ngay.',
    },
    '/seller/forgot-password': {
      title: 'Quên mật khẩu tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Đặt lại mật khẩu một cách nhanh chóng.',
    },
    '/seller/reset-password': {
      title: 'Đặt lại mật khẩu tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Nhập mật khẩu mới để khôi phục tài khoản của bạn.',
    },
    '/seller/verify-code': {
      title: 'Xác minh mã OTP tài khoản - Mua sắm Online | Shopsifu Việt Nam',
      description: 'Xác minh tài khoản của bạn bằng mã OTP.',
    },

    // --------------------------------ADMIN------------------------------------ //
    '/admin':{
      title:'Shopsifu - Kênh người bán',
      description:'Shopsifu - Tổng quan bán hàng'
    },
    '/admin/products':{ 
      title:'Shopsifu - Quản lý sản phẩm',
      description:'Shopsifu - Quản lý sản phẩm'
    },
    '/admin/products/new':{
      title:'Shopsifu - Thêm sản phẩm mới',
      description:'Shopsifu - Thêm sản phẩm mới'
    },
    '/admin/products/[id]':{
      title:'Shopsifu - Chỉnh sửa sản phẩm',
      description:'Shopsifu - Chỉnh sửa sản phẩm'
    },
    '/admin/category':{
      title:'Shopsifu - Quản lý danh mục',
      description:'Shopsifu - Quản lý danh mục'
    },
    '/admin/order':{
      title:'Shopsifu - Danh sách đơn hàng',
      description:'Shopsifu - Danh sách đơn hàng'
    },
    '/admin/voucher':{
      title:'Shopsifu - Quản lý mã giảm giá',
      description:'Shopsifu - Quản lý mã giảm giá'
    },
    '/admin/voucher/new':{
      title:'Shopsifu - Thêm mã giảm giá mới',
      description:'Shopsifu - Thêm mã giảm giá mới'
    },
    '/admin/voucher/edit/[id]':{
      title:'Shopsifu - Chỉnh sửa mã giảm giá',
      description:'Shopsifu - Chỉnh sửa mã giảm giá'
    },
    '/admin/permissions':{
      title:'Shopsifu - Quản lý quyền hạn',
      description:'Shopsifu - Quản lý quyền hạn'
    },
    '/admin/roles':{
      title:'Shopsifu - Quản lý vai trò',
      description:'Shopsifu - Quản lý vai trò'
    },
    '/admin/users':{
      title:'Shopsifu - Quản lý người dùng',
      description:'Shopsifu - Quản lý người dùng'
    },
    '/admin/audit-log':{
      title:'Shopsifu - Nhật ký hoạt động',
      description:'Shopsifu - Nhật ký hoạt động'
    },
    '/admin/languages':{
      title:'Shopsifu - Quản lý ngôn ngữ',
      description:'Shopsifu - Quản lý ngôn ngữ'
    },
    '/admin/brand': {
      title: 'Shopsifu - Quản lý thương hiệu',
      description: 'Shopsifu - Quản lý thương hiệu'
    },
  } satisfies Record<string, { title: string; description: string }>
  