// Default shipping configuration
export const SHIPPING_CONFIG = {
  // Default dimensions and weight for shipping calculation
  DEFAULT_PACKAGE: {
    height: 10,
    weight: 500,
    length: 15,
    width: 10,
  },

  // Default from address (from environment variables or fallback)
  DEFAULT_FROM: {
    districtId: process.env.NEXT_PUBLIC_FROM_DISTRICT_ID
      ? parseInt(process.env.NEXT_PUBLIC_FROM_DISTRICT_ID)
      : 1536,
    wardCode: process.env.NEXT_PUBLIC_FROM_WARD_CODE || "480105",
  },

  // API configuration
  API_CONFIG: {
    timeout: 10000, // 10 seconds
    retryCount: 3,
  },
} as const;

export type ShippingPackage = typeof SHIPPING_CONFIG.DEFAULT_PACKAGE;
export type ShippingFromAddress = typeof SHIPPING_CONFIG.DEFAULT_FROM;
