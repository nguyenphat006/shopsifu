import z from 'zod'

/**
 * https://docs.sepay.vn/tich-hop-webhooks.html
 */
export const WebhookPaymentBodySchema = z.object({
  id: z.number().transform((val) => val.toString()), // ID giao dịch trên SePay
  gateway: z.string(), // Brand name của ngân hàng
  transactionDate: z.string(), // Thời gian xảy ra giao dịch phía ngân hàng
  accountNumber: z.string().nullable(), // Số tài khoản ngân hàng
  code: z.string().nullable(), // Mã code thanh toán (sepay tự nhận diện dựa vào cấu hình tại Công ty -> Cấu hình chung)
  content: z.string().nullable(), // Nội dung chuyển khoản
  transferType: z.enum(['in', 'out']), // Loại giao dịch. in là tiền vào, out là tiền ra
  transferAmount: z.number(), // Số tiền giao dịch
  accumulated: z.number(), // Số dư tài khoản (lũy kế)
  subAccount: z.string().nullable(), // Tài khoản ngân hàng phụ (tài khoản định danh),
  referenceCode: z.string().nullable(), // Mã tham chiếu của tin nhắn sms
  description: z.string() // Toàn bộ nội dung tin nhắn sms
})

export type WebhookPaymentBodyType = z.infer<typeof WebhookPaymentBodySchema>
