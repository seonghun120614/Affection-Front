import { api } from "@/lib/api";

const AUTH_PATH = "/api/auth"

export interface VerifyEmailRequest {
    username: string;
    email: string;
    authCode: string;
}

export interface VerifyNumberRequest {
    uid: string;
    phoneNumber: string;
    authCode: string;
}

export interface RegisterRequest {
    uid: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    uid: string;
    username: string;
}

export const auth = {
    login: async (body: LoginRequest): Promise<LoginResponse> => {
        // 여기서 sessionStorage 로직은 삭제하고 순수하게 API 호출만 담당합니다.
        return await api.post<LoginResponse>(`${AUTH_PATH}/login`, body);
    },

    logout: (): Promise<void> => {
        const res = api.postNoContent(`${AUTH_PATH}/logout`, undefined) as Promise<void>;
        
        sessionStorage.removeItem("uid");
        sessionStorage.removeItem("username");
        
        return res;
    },

    verifyEmail: (body: VerifyEmailRequest): Promise<string | null> =>
        api.postText(`${AUTH_PATH}/email`, body) as Promise <string | null>,

    verifyNumber: (body: VerifyNumberRequest): Promise<string | null> =>
        api.postText(`${AUTH_PATH}/number`, body) as Promise <string | null>
}