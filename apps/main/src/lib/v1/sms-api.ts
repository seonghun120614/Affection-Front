import { api } from "./v1/core/api";

const SMS_PATH = "/api/sms"

export interface SendSmsRequest {
    uid: string;
    phoneNumber: string;
}

export const sms = {
    sendSms: async(body: SendSmsRequest): Promise<void> =>
        api.postNoContent(`${SMS_PATH}/send`, body) as Promise<void>
}