import { api } from "./v1/core/api";

const PERSONA_PATH = "/api/personas";

export interface UpdatePersonaRequest {
    description: string;
    hashtags: string[];
}

export interface PersonaResponse {
    uid: string;
    profileUrl: string;
    hashTags: string[];
    description: string;
}

export const persona = {
    createPersona: async (): Promise<PersonaResponse> =>
        await api.post(PERSONA_PATH),

    updatePersona: async (
        file?: File,
        request?: UpdatePersonaRequest,
    ): Promise<PersonaResponse> => {
        const formData = new FormData();

        if (file) {
            formData.append("file", file);
        }

        if (request) {
            // 백엔드가 @RequestPart("request")로 JSON을 받고 있으므로 Blob으로 감싸서 전송합니다.
            formData.append(
                "request",
                new Blob([JSON.stringify(request)], {
                    type: "application/json",
                }),
            );
        }

        return await api.patch<PersonaResponse>(PERSONA_PATH, formData);
    },

    getMe: async (): Promise<PersonaResponse> => await api.get(PERSONA_PATH),
    getOthers: async (): Promise<PersonaResponse> =>
        await api.get(`${PERSONA_PATH}/others`),
    deleteProfileImage: async (): Promise<void> =>
        await api.delete(PERSONA_PATH),
};
