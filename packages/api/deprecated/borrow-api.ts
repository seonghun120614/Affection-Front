import { api } from "./v1/core/api";

const BORROW_PATH = "/api/borrow";

export interface BorrowResponse {
    uid: string;
    gid: number;
}

export interface LendRequest {
    bid: string;
    gid: number;
}

export const borrow = {
    borrow: async (gid: number): Promise<BorrowResponse> =>
        await api.post(`${BORROW_PATH}/${gid}`),
    lend: async (gid: number, bid: number): Promise<BorrowResponse> =>
        await api.patch(`${BORROW_PATH}/${gid}/to/${bid}`),
};
