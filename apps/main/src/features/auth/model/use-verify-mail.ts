import { api } from "@affection/api";
import { VerifyMailRequest } from "@/entities/mail-props";
import { useMutation } from "@tanstack/react-query";

export const useVerifyMail = () => {
    return useMutation({
        mutationFn: async (body: VerifyMailRequest): Promise<string> =>
            api.post(`/api/auth/verify/email`, body),
        onError: (error) => {
            console.error("인증 실패:", error);
        },
    });
};
