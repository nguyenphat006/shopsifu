// import { getRequestConfig } from "next-intl/server";
// import { cookies } from "next/headers";

// export default getRequestConfig(async () => {
//   // Get language from cookie or default to 'vi'
//   const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value || "vi";
//   const locale = cookieLocale;
//   console.log("locale:", locale);

//   return {
//     locale,
//     messages: (await import(`./messages/${locale}.json`)).default,
//   };
// });


import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Get language from cookie or default to 'vi'
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value || "vi";
  const locale = cookieLocale;
  console.log("locale:", locale);

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    // Thêm dòng này để ngăn next-intl kiểm tra quá nghiêm ngặt
    skipInspection: true,
    
    // Thêm cả dòng này nếu muốn sử dụng khóa của ngôn ngữ mặc định khi không tìm thấy khóa
    defaultLocale: "vi", 
    
    // Thêm dòng này để bỏ qua lỗi thiếu khóa
    onError: (error) => {
      // Chỉ log lỗi, không throw exception
      if (process.env.NODE_ENV === 'development') {
        console.warn('i18n warning:', error.message);
      }
    }
  };
});