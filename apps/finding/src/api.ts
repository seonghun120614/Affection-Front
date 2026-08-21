import { CreateFindingRequest, CreateFoundingRequest } from "../types/finding";

const BASE_URL = "/api/findings";

export const findingApi = {
    createFinding: async (req: CreateFindingRequest) => {
        const response = await fetch(`${BASE_URL}/find`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
        });
        
        if (!response.ok) {
            throw new Error("분실물 등록 실패");
        }
        return response.json();
    },

    // 습득물 등록 요청 (/api/findings/found)
    createFounding: async (req: CreateFoundingRequest) => {
        const response = await fetch(`${BASE_URL}/found`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req),
        });

        if (!response.ok) {
            throw new Error("습득물 등록 실패");
        }
        return response.json();
    },
};