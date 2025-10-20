// "use client";

// import { useEffect } from "react";
// import { startTokenCheck, stopTokenCheck } from "@/lib/api";

// /**
//  * Component phía client chịu trách nhiệm quản lý vòng đời kiểm tra token.
//  * Nó bắt đầu kiểm tra token khi component được mount và dừng lại khi unmount.
//  * Component này không hiển thị bất kỳ giao diện nào.
//  */
// export function TokenManager() {
//   useEffect(() => {
//     // Bắt đầu vòng lặp kiểm tra token khi component được mount
//     startTokenCheck();

//     // Dọn dẹp (dừng) vòng lặp khi component bị unmount
//     return () => {
//       stopTokenCheck();
//     };
//   }, []); // Mảng phụ thuộc rỗng đảm bảo effect này chỉ chạy một lần

//   return null; // Component này không render ra UI
// }