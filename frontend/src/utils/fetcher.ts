//Nơi sẽ tạo hàm fetch api để dùng chung cho mọi loại API ví dụ:

// src/app/utils/fetcher.js ở đây có kiểm tra trường hợp nếu có 2 url backend luôn, sẽ gắn true nếu muốn sử dụng url thứ 2 là secondary
// fetcher.ts

export async function fetcher(
  endpoint: string, 
  options: RequestInit = {}, 
  useSecondary: boolean = false
): Promise<any> {
  const BASE_URL = useSecondary
    ? process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL
    : process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const responseData = await response.json();
  console.log(responseData);
  if (!response.ok) {
    const errorMessage = responseData.message || "Hệ thống đang bảo trì, quý khách vui lòng thử lại sau ít phút.";
    throw new Error(errorMessage);
  }

  return responseData;
}

