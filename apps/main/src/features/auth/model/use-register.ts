import { api } from "@affection/api";
import { RegisterRequest, RegisterResponse } from "@/entities";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
    return useMutation({
        mutationFn: async (body: RegisterRequest): Promise<RegisterResponse> =>
            api.post<RegisterResponse>(`/api/users/register`, body),
        onSuccess: (data) => console.log("회원가입 성공:", data),
        onError: (error) => console.error("회원가입 실패:", error),
    });
};
