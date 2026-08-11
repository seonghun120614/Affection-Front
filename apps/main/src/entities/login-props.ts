export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    uid: string;
    username: string;
}
