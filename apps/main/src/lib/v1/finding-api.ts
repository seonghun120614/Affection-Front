import { api } from "./v1/core/api";

const FINDING_PATH = "/api/findings";

// 1. 공통/페이징 응답 인터페이스
export interface PageResponse<T> {
    content: T[];
    pageable: any;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    empty: boolean;
}

export interface PageRequestParams {
    page?: number;
    size?: number;
    sort?: string;
}

// 2. Response DTOs
export interface FindingResponse {
    title: string;
    description: string;
    affection: number;
    createdAt: string;
}

export interface FoundingResponse {
    title: string;
    imgUrl: string;
    description: string;
    createdAt: string;
}

export interface MatchResponse {
    mid: number;
    findingId: number;
    foundingId: number;
}

// 3. Request DTOs
export interface CreateFindingRequest {
    title: string;
    desc: string;
    affection: number;
}

export interface CreateFoundingRequest {
    title: string;
    img: string;
    desc: string;
}

export interface UpdateFindingRequest {
    title: string;
    desc: string;
    affection: number;
}

export interface UpdateFoundingRequest {
    title: string;
    img: string;
    desc: string;
}

export interface MatchRequest {
    findingId: number;
    foundingId: number;
}

// ==========================================
// 유틸리티 함수: 객체를 쿼리 스트링으로 변환
// ==========================================
const toQueryString = (params?: PageRequestParams): string => {
    if (!params) return "";
    
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.append("page", params.page.toString());
    if (params.size !== undefined) searchParams.append("size", params.size.toString());
    if (params.sort) searchParams.append("sort", params.sort);
    
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
};

// 4. API Client
export const finding = {
    // 분실 신고 (Find)
    createFinding: async (body: CreateFindingRequest): Promise<FindingResponse> => 
        await api.post(`${FINDING_PATH}/find`, body),
        
    getFindings: async (params?: PageRequestParams): Promise<PageResponse<FindingResponse>> => 
        await api.get(`${FINDING_PATH}/find${toQueryString(params)}`),
        
    getFinding: async (findingId: number): Promise<FindingResponse> => 
        await api.get(`${FINDING_PATH}/find/${findingId}`),
        
    updateFinding: async (findingId: number, body: UpdateFindingRequest): Promise<FindingResponse> => 
        await api.patch(`${FINDING_PATH}/find/${findingId}`, body),
        
    deleteFinding: async (findingId: number): Promise<void> => 
        await api.delete(`${FINDING_PATH}/find/${findingId}`),

    // 습득 신고 (Found)
    createFounding: async (body: CreateFoundingRequest): Promise<FoundingResponse> => 
        await api.post(`${FINDING_PATH}/found`, body),
        
    getFoundings: async (params?: PageRequestParams): Promise<PageResponse<FoundingResponse>> => 
        await api.get(`${FINDING_PATH}/found${toQueryString(params)}`),
        
    getFounding: async (foundingId: number): Promise<FoundingResponse> => 
        await api.get(`${FINDING_PATH}/found/${foundingId}`),
        
    updateFounding: async (foundingId: number, body: UpdateFoundingRequest): Promise<FoundingResponse> => 
        await api.patch(`${FINDING_PATH}/found/${foundingId}`, body),
        
    deleteFounding: async (foundingId: number): Promise<void> => 
        await api.delete(`${FINDING_PATH}/found/${foundingId}`),

    // 매칭 (Match)
    match: async (body: MatchRequest): Promise<MatchResponse> => 
        await api.post(`${FINDING_PATH}/match`, body),
        
    unmatch: async (mid: number): Promise<void> => 
        await api.delete(`${FINDING_PATH}/unmatch/${mid}`)
};