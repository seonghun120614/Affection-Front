import { api } from "./v1/core/api";

const GOOD_PATH = "/api/goods";

export interface GoodResponse {
    gid: number,
    name: string,
    price: number
}

export const good = {
    getAll: async(): Promise<GoodResponse[]> =>
        await api.get(GOOD_PATH),
    get: async(gid: number): Promise<GoodResponse> =>
        await api.get(`${GOOD_PATH}/${gid}`)
}