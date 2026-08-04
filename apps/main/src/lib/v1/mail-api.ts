import { api } from "./v1/core/api";

const MAIL_PATH = "/api/mail"

export interface SendMailRequest {
    username: string;
    email: string;
}

export const mail = {
    sendMail: async(body: SendMailRequest): Promise<void> =>
        api.postNoContent(`${MAIL_PATH}/send`, body) as Promise<void>
}