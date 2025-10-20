import { useState, useCallback, useEffect } from "react"
import { roleService } from "@/services/roleService"
import { permissionService } from "@/services/permissionService"
import { showToast } from "@/components/ui/toastify"
import { parseApiError } from "@/utils/error"
import {
  RoleGetAllResponse,
  RoleCreateRequest,
  RoleUpdateRequest,
  Permission,
  RoleGetByIdResponse
} from "@/types/auth/role.interface"
import { PerGetAllResponse, PermissionDetail } from "@/types/auth/permission.interface"
import { Role } from "./roles-Columns"
import { useServerDataTable } from "@/hooks/useServerDataTable"
import { useTranslations } from "next-intl"

export function useRoles() {
  const t = useTranslations();
  
  // Modal states
  const [upsertOpen, setUpsertOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null)
  
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Permissions data for the modal
  const [permissionsData, setPermissionsData] = useState<Record<string, PermissionDetail[]>>({})
  const [isPermissionsLoading, setIsPermissionsLoading] = useState(true)
  
  // Callbacks for useServerDataTable
  const getResponseData = useCallback((response: any) => {
    return response.data || []
  }, [])

  const getResponseMetadata = useCallback((response: any) => {
    const metadata = response.metadata || {}
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false
    }
  }, [])

  const mapResponseToData = useCallback((role: any): Role => {
    return {
      ...role,
      id: role.id, // Giữ nguyên id dạng string/UUID từ API
      description: role.description || "",
      isActive: role.isActive ?? true,
    }
  }, [])

  // Use the useServerDataTable hook
  const {
    data: roles,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  } = useServerDataTable({
    fetchData: roleService.getAll,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: "createdAt", sortOrder: "asc" },
    defaultLimit: 10,
     requestConfig: {
      includeSearch: false, // Không gửi tham số search trong request API
      includeSort: false,   // Không gửi các tham số sắp xếp (sortBy, sortOrder)
      includeCreatedById: true // Vẫn gửi tham số createdById nếu có
    },
  })

  // Fetch permissions for the modal
  const fetchPermissions = useCallback(async () => {
    try {
      setIsPermissionsLoading(true)
      // Truyền limit=1000 để lấy tất cả permissions mà không cần sắp xếp từ API
      const response = await permissionService.getAll({ 
        page: 1, 
        limit: 1000
      })
      
      // Kiểm tra cấu trúc dữ liệu trả về
      const responseData = Array.isArray(response.data) ? response.data : [];
      console.log("Permissions API response data:", responseData.length ? "Có dữ liệu" : "Không có dữ liệu");
      
      // Nếu API không hỗ trợ sort, chúng ta có thể sắp xếp mảng kết quả ở client
      // Sắp xếp data theo module trước khi tiếp tục xử lý
      const sortedData = [...responseData].sort((a, b) => {
        const moduleA = a.module || "OTHERS";
        const moduleB = b.module || "OTHERS";
        return moduleA.localeCompare(moduleB);
      });
      
      // Tạo cấu trúc dữ liệu phù hợp dựa trên module (vì API không còn gộp sẵn)
      // Sử dụng sortedData thay vì response.data để dữ liệu đã được sắp xếp
      const groupedPermissions = sortedData.reduce((acc: Record<string, PermissionDetail[]>, item) => {
        // Lấy module làm key để gộp permissions
        const moduleKey = item.module || "OTHERS";
        
        if (!acc[moduleKey]) {
          acc[moduleKey] = [];
        }
        
        // Tạo action hiển thị đầy đủ: METHOD + Path
        const enrichedItem = {
          ...item,
          action: `${item.method} - ${item.path}`
        };
        
        acc[moduleKey].push(enrichedItem);
        return acc;
      }, {});
      
      // Lưu dữ liệu đã nhóm vào state
      setPermissionsData(groupedPermissions)
      
      // Log thông tin để debug
      console.log("Permissions grouped by modules:", Object.keys(groupedPermissions));
      console.log("Total permissions count:", sortedData.length);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      showToast(parseApiError(error), "error")
    } finally {
      setIsPermissionsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPermissions()
  }, [fetchPermissions])

  // CRUD operations
  const addRole = async (data: RoleCreateRequest) => {
    try {
      const response = await roleService.create(data)
      showToast(response.message || "Tạo vai trò thành công", "success")
      refreshData()
      handleCloseUpsertModal()
      return response
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi tạo vai trò:", error)
      return null
    }
  }

  const editRole = async (id: string, data: RoleUpdateRequest) => {
    try {
      const response = await roleService.update(id, data) // id đã là string nên không cần chuyển đổi
      showToast(response.message || "Cập nhật vai trò thành công", "success")
      refreshData()
      handleCloseUpsertModal()
      return response
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi cập nhật vai trò:", error)
      return null
    }
  }

  const handleConfirmDelete = async (): Promise<void> => {
    if (roleToDelete) {
      setDeleteLoading(true)
      try {
        const response = await roleService.delete(roleToDelete.id) // id đã là string nên không cần String()
        showToast(response.message || "Xóa vai trò thành công", "success")
        refreshData()
        handleCloseDeleteModal()
      } catch (error) {
        showToast(parseApiError(error), "error")
        console.error("Lỗi khi xóa vai trò:", error)
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  // Modal handlers
  const handleOpenDelete = (role: Role) => {
    setRoleToDelete(role)
    setDeleteOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false)
    setRoleToDelete(null)
  }

  // Fetch role details by ID including permissions
  const fetchRoleDetails = async (roleId: string) => {
    try {
      setIsPermissionsLoading(true)
      const response = await roleService.getById(roleId) // roleId đã là string
      
      // Kiểm tra và log API response để debug
      console.log("Role API response structure:", response);
      
      // Update roleToEdit with full details including permissions
      if (response) {
        // API có thể trả về dữ liệu trong cấu trúc khác nhau
        // Cần kiểm tra cấu trúc phản hồi từ API
        let roleDetails: any;
        
        if (typeof response === 'object' && response !== null) {
          // Kiểm tra nếu response có trường data và data chứa thông tin role
          if ('data' in response && response.data && typeof response.data === 'object') {
            roleDetails = response.data;
            console.log("Using response.data as role details");
          } else {
            // Sử dụng trực tiếp response nếu nó chứa thông tin role
            roleDetails = response;
            console.log("Using direct response as role details");
          }
          
          console.log("API Response for role details:", roleDetails);
          
          // Extract the necessary data and explicitly type as Role
          const roleData: Role = {
            id: roleDetails.id,
            name: roleDetails.name,
            description: roleDetails.description || "",
            isActive: roleDetails.isActive ?? true,
            createdById: roleDetails.createdById,
            updatedById: roleDetails.updatedById,
            deletedById: roleDetails.deletedById,
            deletedAt: roleDetails.deletedAt,
            createdAt: roleDetails.createdAt,
            updatedAt: roleDetails.updatedAt,
            // Làm phong phú permissions với trường action để phù hợp với UI
            permissions: Array.isArray(roleDetails.permissions) 
              ? roleDetails.permissions.map((p: any) => ({
                  ...p,
                  id: p.id.toString(), // Đảm bảo id là string
                  action: `${p.method} - ${p.path}` // Thêm trường action cho UI
                }))
              : []
          }
          
          // Lưu roleData vào state và log thông tin
          setRoleToEdit(roleData)
          
          // Log for debugging
          console.log("Processed role data:", roleData)
          console.log("Permissions count:", roleData.permissions?.length || 0)
          console.log("Role permissions:", roleData.permissions)
        }
      }
    } catch (error) {
      showToast(parseApiError(error), "error")
      console.error("Lỗi khi lấy chi tiết vai trò:", error)
    } finally {
      setIsPermissionsLoading(false)
    }
  }
  
  const handleOpenUpsertModal = (mode: 'add' | 'edit', role?: Role) => {
    setModalMode(mode)
    
    if (mode === 'edit' && role) {
      console.log("Opening edit modal for role:", role)
      setRoleToEdit(role)
      // Fetch detailed role info including permissions
      fetchRoleDetails(role.id)
      // Lưu ý: role.id đã là string, phù hợp với UUID từ API
    } else {
      console.log("Opening add modal")
      setRoleToEdit(null)
    }
    
    setUpsertOpen(true)
  }

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false)
    setRoleToEdit(null)
  }

  return {
    data: roles,
    loading,
    pagination,
    
    // Server-side pagination handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    
    // Delete
    deleteOpen,
    roleToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    // Upsert
    upsertOpen,
    modalMode,
    roleToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addRole,
    editRole,
    fetchRoleDetails,

    // Permissions data
    permissionsData,
    isPermissionsLoading,
  }
}
