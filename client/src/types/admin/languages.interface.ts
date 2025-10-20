export interface LangCreateRequest {
    id: string;
    name: string;
}

export interface LangCreateResponse {
    id: string;
    name: string;
    createdById: string;
    updatedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface LangGetAllResponse {
    data: Array<{
        id: string;
        name: string;
        createdById: string;
        updatedById: string;
        deletedAt: string;
        createdAt: string;
        updatedAt: string;
    }>;
    totalItems: number;
    page: number;
    totalPages: number;
}

export interface LangListResponse {
    data: LangGetAllResponse[];
    totalItems: number;
    page: number;
    totalPages: number;
    limit: number;
  }

export interface LangUpdateRequest {
    name: string;
}

export interface LangUpdateResponse {
    id: string;
    name: string;
    createdById: string;
    updatedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface LangDeleteRequest {
    id: string;
}

export interface LangDeleteResponse {
    message: string;
}

export interface LangGetByIdResponse {
    id: string;
    name: string;
    createdById: string;
    updatedById: string;
    deletedAt: string;
    createdAt: string;
    updatedAt: string;
}
