import { api } from "./v1/core/api";

const CHATROOM_PATH = "/api/chatrooms";

export interface ChatroomResponse {
    cid: number;
    name: string;
    imgUrl: string;
    description: string;
}

export interface ChatParticipantsResponse {
    uid: string
}

export interface CreateGroupRoomRequest {
    name: string;
    imgUrl: string;
    description: string;
}

export interface DirectRoomRequest {
    targetUid: string;
}

export interface UpdateChatRoomRequest {
    name: string;
    imgUrl: string;
    description: string;
}

export const chatroom = {
    getOrCreateDirect: async(body: DirectRoomRequest): Promise<ChatroomResponse> =>
        await api.post(`${CHATROOM_PATH}/direct`, body),

    createGroup: async(body: CreateGroupRoomRequest): Promise<ChatroomResponse> =>
        await api.post(`${CHATROOM_PATH}/group`, body),

    join: async(roomId: number): Promise<void> =>
        await api.post(`${CHATROOM_PATH}/${roomId}/join`),

    leave: async(roomId: number): Promise<void> =>
        await api.delete(`${CHATROOM_PATH}/${roomId}/leave`),

    updateChatRoom: async(roomId: number, body: UpdateChatRoomRequest): Promise<ChatroomResponse> =>
        await api.patch(`${CHATROOM_PATH}/${roomId}`, body),

    getParticipants: async(roomId: number): Promise<ChatParticipantsResponse[]> => 
        await api.get(`${CHATROOM_PATH}/${roomId}/participants`)
}