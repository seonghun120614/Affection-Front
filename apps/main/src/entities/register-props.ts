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
