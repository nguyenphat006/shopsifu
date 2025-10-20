// import { Brand } from "./brand-Columns"

// export const mockBrandData: Brand[] = [
//   {
//     id: 1,
//     code: "APPLE",
//     name: "Apple",
//     description: "Công ty công nghệ đa quốc gia của Mỹ, chuyên thiết kế và phát triển thiết bị điện tử tiêu dùng.",
//     logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
//     website: "https://www.apple.com",
//     country: "Hoa Kỳ",
//     status: "active",
//     createdAt: "2024-01-15T08:00:00Z",
//     updatedAt: "2024-12-01T10:30:00Z"
//   },
//   {
//     id: 2,
//     code: "SAMSUNG",
//     name: "Samsung",
//     description: "Tập đoàn đa quốc gia Hàn Quốc, là một trong những nhà sản xuất điện tử lớn nhất thế giới.",
//     logo: "https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png",
//     website: "https://www.samsung.com",
//     country: "Hàn Quốc",
//     status: "active",
//     createdAt: "2024-01-20T09:15:00Z",
//     updatedAt: "2024-11-28T14:20:00Z"
//   }
// ]

// // Utility functions for working with brand data
// export const getBrandByCode = (code: string): Brand | undefined => {
//   return mockBrandData.find(brand => brand.code === code)
// }

// export const getBrandById = (id: string | number): Brand | undefined => {
//   return mockBrandData.find(brand => brand.id === id)
// }

// export const getActiveBrands = (): Brand[] => {
//   return mockBrandData.filter(brand => brand.status === "active")
// }

// export const getInactiveBrands = (): Brand[] => {
//   return mockBrandData.filter(brand => brand.status === "inactive")
// }

// export const getBrandsByCountry = (country: string): Brand[] => {
//   return mockBrandData.filter(brand => brand.country === country)
// }

// export const searchBrands = (query: string): Brand[] => {
//   const lowercaseQuery = query.toLowerCase()
//   return mockBrandData.filter(brand => 
//     brand.name.toLowerCase().includes(lowercaseQuery) ||
//     brand.code.toLowerCase().includes(lowercaseQuery) ||
//     brand.description?.toLowerCase().includes(lowercaseQuery) ||
//     brand.country?.toLowerCase().includes(lowercaseQuery)
//   )
// }

// // Export total count
// export const totalBrandsCount = mockBrandData.length
