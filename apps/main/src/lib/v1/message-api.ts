import { api } from "./v1/core/api";

const MESSAGE_PATH = "/api/messages";

export interface MessageResponse {
    mid: number;
    uid: string;
    username: string;
    message: string;
    createdAt: string;
}

export const message = {
    getMessages: async(cid: number, size: number = 30): Promise<MessageResponse[]> =>
        await api.get(`${MESSAGE_PATH}/${cid}?size=${size}`)
}