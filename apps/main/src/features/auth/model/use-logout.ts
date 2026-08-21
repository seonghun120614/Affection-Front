import { api } from "@affection/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = (redirect: (path: string) => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (): Promise<void> =>
            api.postNoContent("/api/auth/logout"),

        onSuccess: () => {
            sessionStorage.removeItem("username");
            queryClient.invalidateQueries({ queryKey: ["user"] });
            redirect("/");
        },
        onError: (error) => {
            console.error("로그아웃 실패:", error);
            alert("로그아웃 처리 중 오류가 발생했습니다.");
        },
    });
};