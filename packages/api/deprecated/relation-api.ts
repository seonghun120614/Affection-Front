import { api } from "./v1/core/api";

const RELATION_PATH = "/api/relations";

export interface ConnectRequest {
    type: string;
    other: string;
}

export interface RelationshipResponse {
    rid: number;
    uid: string;
    username: string;
    relation: string;
}

export const relation = {
    connect: async (body: ConnectRequest): Promise<RelationshipResponse> =>
        await api.post(`${RELATION_PATH}/connect`, body),

    getRelationships: async (): Promise<RelationshipResponse[]> =>
        await api.get(`RELATION_PATH`),

    // pullAddress: 웹에서는 안됨,
    block: async (other: string): Promise<void> =>
        await api.patch(`${RELATION_PATH}/block/${other}`),

    unblock: async (other: string): Promise<void> =>
        await api.delete(`${RELATION_PATH}/unblock/${other}`),
};
