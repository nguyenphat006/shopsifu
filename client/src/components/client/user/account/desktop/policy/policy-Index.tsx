"use client";

export default function PolicyIndex() {
  return (
    <div className="max-w-[1200px] mx-auto bg-white p-8 text-base leading-relaxed shadow-sm rounded-lg my-6">
      <h1 className="text-3xl font-bold text-[#d70018] mb-8">
        Chính sách bảo hành
      </h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[#d70018]">
          1. Điều kiện bảo hành
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Sản phẩm còn thời hạn bảo hành theo quy định của nhà sản xuất.
          </li>
          <li>Có phiếu bảo hành hoặc hóa đơn mua hàng.</li>
          <li>Không bị hư hỏng do người dùng gây ra (rơi vỡ, vào nước...).</li>
        </ul>
      </section>

      <section className="space-y-4 mt-10">
        <h2 className="text-xl font-semibold text-[#d70018]">
          2. Quy trình bảo hành
        </h2>
        <p className="text-gray-700">
          Khách hàng liên hệ trung tâm hỗ trợ hoặc mang sản phẩm đến cửa hàng
          gần nhất để được kiểm tra và xử lý bảo hành.
        </p>
      </section>

      <section className="space-y-4 mt-10">
        <h2 className="text-xl font-semibold text-[#d70018]">
          3. Thời gian bảo hành
        </h2>
        <p className="text-gray-700">
          Thời gian xử lý bảo hành từ 7 - 14 ngày làm việc tùy tình trạng sản
          phẩm.
        </p>
      </section>
    </div>
  );
}
