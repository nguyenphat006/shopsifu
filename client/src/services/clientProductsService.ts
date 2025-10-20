import { publicAxios } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import { 
  ClientProductsResponse, 
  ClientProductDetail, 
  ClientProductsListParams,
  ClientSearchResponse,
  ClientSearchParams
} from "@/types/client.products.interface";

export const clientProductsService = {
  /**
   * Get a list of products with flexible filtering options
   * @param params - All parameters for filtering, pagination, etc.
   * @returns Promise with the products response
   */
  getProducts: async (params?: ClientProductsListParams): Promise<ClientProductsResponse> => {
    try {
      const response = await publicAxios.get(API_ENDPOINTS.PRODUCTS.LIST, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching client products:", error);
      throw error;
    }
  },

  /**
   * Get detailed information about a specific product
   * @param id - The product ID (extracted from slug or direct ID)
   * @returns Promise with the product detail
   */
  getProductDetail: async (id: string): Promise<ClientProductDetail> => {
    try {
      const url = API_ENDPOINTS.PRODUCTS.DETAIL.replace(":id", id);
      const response = await publicAxios.get(url);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching client product detail with id ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search for products based on query string and other filters
   * @param params - Search parameters including query string and filters
   * @returns Promise with search results
   */
  searchProducts: async (params: ClientSearchParams): Promise<ClientSearchResponse> => {
    try {
      console.log("🔍 Searching products with params:", params);
      const response = await publicAxios.get(API_ENDPOINTS.PRODUCTS.SEARCH, { params });
      console.log("🔍 Search response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  /**
   * Get search suggestions based on a query string
   * Used for autocomplete in search inputs
   * @param query - The search query
   * @param limit - Maximum number of results to return
   * @returns Promise with search suggestions
   */
  getSearchSuggestions: async (query: string, limit: number = 5, options: any): Promise<ClientSearchResponse> => {
    try {
      const response = await publicAxios.get(API_ENDPOINTS.PRODUCTS.SEARCH, { 
        params: { q: query, limit },
        signal: options?.signal // <-- truyền signal vào đây
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      throw error;
    }
  }
};