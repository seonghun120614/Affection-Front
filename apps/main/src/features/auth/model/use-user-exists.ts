import { api } from "@affection/api";
import { useQuery } from "@tanstack/react-query";

export const useUserExists = (username: string) => {
    return useQuery({
        queryKey: ["user", "exists", username],
        queryFn: () => api.get<boolean>(`/api/users/exists/${username}`),
        enabled: username?.length >= 2,
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false,
    });
};
