import { api } from "@affection/api";
import { VerifyMailRequest } from "@/entities/mail-props";
import { useMutation } from "@tanstack/react-query";

export const useVerifyMail = () => {
    return useMutation({
        mutationFn: async (body: VerifyMailRequest): Promise<string> =>
            api.postText(`/api/auth/email`, body),
        onError: (error) => {
            console.error("인증 실패:", error);
        },
    });
};
