import { api } from "./v1/core/api";

const USER_PATH = "/api/users"

export interface RegisterRequest {
    uid: string;
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
}

export interface RegisterResponse {
    uid: string;
    username: string;
}

export const user = {

    exists: (username: string): Promise<boolean> => {
        return api.get(`${USER_PATH}/exists/${username}`) as Promise<boolean>;
    },

    register: (body: RegisterRequest): Promise<RegisterResponse> => {
        return api.post(USER_PATH + "/register", body) as Promise<RegisterResponse>;
    }
}