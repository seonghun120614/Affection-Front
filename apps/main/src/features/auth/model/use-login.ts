import { api } from "@affection/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoginRequest, LoginResponse } from "@/entities";

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (body: LoginRequest): Promise<LoginResponse> =>
            api.post<LoginResponse>(`/api/auth/login`, body),

        onSuccess: (data) => {
            sessionStorage.setItem("username", data.username);
            queryClient.invalidateQueries({ queryKey: ["user"] });
            router.push("/");
        },
        onError: (error) => {
            console.error("로그인 실패:", error);
            alert("아이디 또는 비밀번호를 확인해주세요.");
        },
    });
};
