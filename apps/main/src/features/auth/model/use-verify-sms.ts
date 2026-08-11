import { api } from "@affection/api";
import { useMutation } from "@tanstack/react-query";
import { VerifySmsRequest } from "@/entities/sms-props";

export const useVerifySms = () => {
    return useMutation({
        mutationFn: async (body: VerifySmsRequest): Promise<string> =>
            api.post<string>(`/api/auth/veify/sms`, body),
        onError: (error) => {
            console.error("인증 실패:", error);
        },
    });
};
