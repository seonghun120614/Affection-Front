import { api } from "./v1/core/api";

const LOCALIZE_PATH = "/api/localize"

export interface UpdateLocalOrCreateRequest {
    longitude: number;
    latitude: number;
}

export const localize = {
    updateLocalOrCreate: async(body: UpdateLocalOrCreateRequest): Promise<void> =>
        await api.post(LOCALIZE_PATH, body)
}