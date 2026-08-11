import { api } from "@affection/api";
import { useQuery } from "@tanstack/react-query";

export const useUserExists = (username: string) => {
    return useQuery({
        queryKey: ["user", "exists", username],
        queryFn: () => api.get<boolean>(`/api/users/exists/${username}`),
        enabled: username.length >= 2,
        staleTime: 1000 * 60, // 1분간은 동일한 username으로 요청 시 캐시 사용
    });
};
