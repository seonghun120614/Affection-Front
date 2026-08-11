export interface SendSmsRequest {
    uid: string;
    phoneNumber: string;
}

export interface VerifySmsRequest {
    uid: string;
    phoneNumber: string;
    authCode: string;
}
