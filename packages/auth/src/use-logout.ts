import { api } from "@affection/api";

export function useLogout(loginUrl: string) {
    const logout = async () => {
        try {
            await api.postNoContent("/api/auth/logout");
        } finally {
            window.location.href = loginUrl;
        }
    };

    return { logout };
}
