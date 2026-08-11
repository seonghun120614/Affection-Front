export interface SendMailRequest {
    username: string;
    email: string;
}

export interface VerifyMailRequest {
    username: string;
    email: string;
    authCode: string;
}
