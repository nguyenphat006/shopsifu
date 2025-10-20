import axios from 'axios';

const BASE_URL = 'https://provinces.open-api.vn/api';

// Define interfaces for the response data
export interface Province {
  code: string;
  name: string;
  division_type: string;
  codename: string;
  phone_code: string;
  districts?: District[];
}

export interface District {
  code: string;
  name: string;
  division_type: string;
  codename: string;
  province_code: string;
  wards?: Ward[];
}

export interface Ward {
  code: string;
  name: string;
  division_type: string;
  codename: string;
  district_code: string;
}

/**
 * Service to interact with the provinces.open-api.vn API
 */
export const provincesService = {
  /**
   * Get list of all provinces
   * @param depth Optional parameter to include nested districts (depth=2) or districts and wards (depth=3)
   * @returns Promise with array of provinces
   */
  getProvinces: async (depth?: number): Promise<Province[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/p`, {
        params: depth ? { depth } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw error;
    }
  },

  /**
   * Get a specific province by code
   * @param code Province code
   * @param depth Optional parameter to include nested districts (depth=2) or districts and wards (depth=3)
   * @returns Promise with province data
   */
  getProvince: async (code: string, depth?: number): Promise<Province> => {
    try {
      const response = await axios.get(`${BASE_URL}/p/${code}`, {
        params: depth ? { depth } : {}
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching province with code ${code}:`, error);
      throw error;
    }
  },

  /**
   * Get list of all districts
   * @param depth Optional parameter to include nested wards (depth=2)
   * @returns Promise with array of districts
   */
  getDistricts: async (depth?: number): Promise<District[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/d`, {
        params: depth ? { depth } : {}
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw error;
    }
  },

  /**
   * Get districts by province code
   * @param provinceCode Province code
   * @param depth Optional parameter to include nested wards (depth=2)
   * @returns Promise with array of districts
   */
  getDistrictsByProvince: async (provinceCode: string, depth?: number): Promise<District[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/p/${provinceCode}`, {
        params: { depth: depth || 2 }
      });
      return response.data.districts || [];
    } catch (error) {
      console.error(`Error fetching districts for province ${provinceCode}:`, error);
      throw error;
    }
  },

  /**
   * Get a specific district by code
   * @param code District code
   * @param depth Optional parameter to include nested wards (depth=2)
   * @returns Promise with district data
   */
  getDistrict: async (code: string, depth?: number): Promise<District> => {
    try {
      const response = await axios.get(`${BASE_URL}/d/${code}`, {
        params: depth ? { depth } : {}
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching district with code ${code}:`, error);
      throw error;
    }
  },

  /**
   * Get list of all wards
   * @returns Promise with array of wards
   */
  getWards: async (): Promise<Ward[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/w`);
      return response.data;
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  },

  /**
   * Get wards by district code
   * @param districtCode District code
   * @returns Promise with array of wards
   */
  getWardsByDistrict: async (districtCode: string): Promise<Ward[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/d/${districtCode}`, {
        params: { depth: 2 }
      });
      return response.data.wards || [];
    } catch (error) {
      console.error(`Error fetching wards for district ${districtCode}:`, error);
      throw error;
    }
  },

  /**
   * Get a specific ward by code
   * @param code Ward code
   * @returns Promise with ward data
   */
  getWard: async (code: string): Promise<Ward> => {
    try {
      const response = await axios.get(`${BASE_URL}/w/${code}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ward with code ${code}:`, error);
      throw error;
    }
  },

  /**
   * Search for provinces, districts or wards by name
   * @param q Search query
   * @param type Type of administrative unit to search for (p: province, d: district, w: ward)
   * @returns Promise with search results
   */
  search: async (q: string, type?: 'p' | 'd' | 'w'): Promise<any[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { q, ...(type ? { type } : {}) }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching for "${q}":`, error);
      throw error;
    }
  }
};

export default provincesService;