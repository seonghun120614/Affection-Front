import { api } from "./v1/core/api";

const INFO_PATH = "/api/infos";

// ==========================================
// 1. Response DTO
// ==========================================
export interface InfoResponse {
    informer: string;
    description: string;
    affection: number; // Java의 int는 TypeScript의 number로 매핑됩니다.
}

// ==========================================
// 2. Request DTO
// ==========================================
// 백엔드에서 POST와 PATCH 모두 CreateInfoRequest 레코드를 사용하므로 하나로 통합하여 정의합니다.
export interface InfoRequest {
    description: string;
}

// ==========================================
// 3. API Client
// ==========================================
export const info = {
    // 정보 등록
    create: async (body: InfoRequest): Promise<InfoResponse> =>
        await api.post(INFO_PATH, body),

    // 단건 정보 조회
    getInfo: async (iid: number): Promise<InfoResponse> =>
        await api.get(`${INFO_PATH}/${iid}`),

    // 주변 정보 목록 조회 (List<InfoDTO> -> InfoResponse[])
    getNearByInfos: async (): Promise<InfoResponse[]> =>
        await api.get(INFO_PATH),

    // 정보 수정
    updateInfo: async (iid: number, body: InfoRequest): Promise<InfoResponse> =>
        await api.patch(`${INFO_PATH}/${iid}`, body),

    // 정보 삭제
    delete: async (iid: number): Promise<void> =>
        await api.delete(`${INFO_PATH}/${iid}`),
};
