/**
 * 한 번만 refresh 하도록 함
 *
 * true: refresh 성공
 * false: refresh 실패, 에외 발생
 * null: 한 개의 요청 생명주기 내에서 한 번도 refresh 를 안함
 */
let refreshInFlight: Promise<boolean> | null = null;

// 서버로 보낼 데이터(body)가 undefined가 아닐 때만 안전하게 JSON 문자열로 변환(JSON.stringify)해 주는 헬퍼 함수
// 자바스크립트 객체 ➔ 문자열
const json = (body?: unknown) =>
    body === undefined ? undefined : JSON.stringify(body);

export class ApiError extends Error {
    constructor(
        readonly status: number,
        readonly code: string,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

function refreshOnce() {
    // 이미 진행 중인 리프레시 요청이 있다면, 새로운 fetch를 쏘지 않고 기존 Promise를 재사용
    refreshInFlight ??= fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
    })
        .then((res) => res.ok) // 2xx 대면 true, 아니면 false
        .catch(() => false) // 네트워크 에러 시 false
        .finally(() => {
            // 요청이 성공하든 실패하든 끝나면, 다음 API 요청을 위해 반드시 null로 초기화
            refreshInFlight = null;
        });
    return refreshInFlight;
}

/**
 * 모든 요청이 해당 메서드를 거쳐야 한다. 기본적으로 비동기이며, 실패시 재시도를 한다.
 *
 * @param path backend 쪽의 host:port 를 제외한 path
 * @param init HTTP 요청을 보낼 때 필요한 설정 정보(메서드, 헤더, 바디 등)를 통째로 담아두는 설정 객체
 * @param retry 인증 만료(401) 혹은 모종의 이유로 인해 원래 하려던 요청을 재시도할 것인지 여부
 * @returns
 */
async function request(
    path: string,
    init: RequestInit,
    retry = true,
): Promise<Response> {
    // 기본 요청을 보냄
    const res = await fetch(path, {
        ...init, // method, body, headers 가 들어가 있음, RequestInit 참고
        headers: {
            "Content-Type": "application/json",
            ...init.headers,
        },
        credentials: "include",
    });

    // 401 이거나 retry 시도 시 다시 전송
    if (res.status === 401 && retry) {
        if (await refreshOnce()) return request(path, init, false); // 재귀 호출로 다시 시도
        throw new ApiError(401, "UNAUTHENTICATED", "다시 로그인해주세요.");
    }

    if (!res.ok) {
        let body: {
            code?: string;
            message?: string;
        } = {};

        try {
            body = await res.json();
        } catch {
            /* 본문이 없거나 JSON이 아님 */
            console.log(
                `상태코드 ${res.status}, 본문이 없거나 JSON 이 아닙니다.`,
            );
        }
        throw new ApiError(
            res.status,
            body.code ?? "UNKNOWN",
            body.message ?? `요청에 실패했습니다 (${res.status})`,
        );
    }

    return res;
}

export const api = {
    // 기본적으로 204 가 반환 안된다는 가정
    get: async <T>(path: string): Promise<T> => {
        const res = await request(path, { method: "GET" });
        return res.json() as T;
    },

    // 기본적으로 204 가 반환 안된다는 가정,
    // 그럼에도 불구하고 필요시에 204 가 있을 시 아래 postNoContent 사용
    post: async <T>(path: string, body?: unknown): Promise<T> => {
        const res = await request(path, { method: "POST", body: json(body) });
        return (await res.json()) as T;
    },

    postNoContent: async (path: string, body?: unknown): Promise<void> => {
        await request(path, { method: "POST", body: json(body) });
    },

    /**
     * 특수한 경우에만 사용, 반환이 string 이거나 아니면 null 임
     */
    postText: async (path: string, body?: unknown): Promise<string | null> => {
        const res = await request(path, { method: "POST", body: json(body) });
        if (res.status === 204) return null;
        const text = (await res.text()).trim();
        return text.length > 0 ? text : null;
    },

    // 기본적으로 204 가 반환 안된다는 가정
    patch: async <T>(path: string, body?: unknown): Promise<T> => {
        const res = await request(path, { method: "PATCH", body: json(body) });
        return (await res.json()) as T;
    },

    // 기본적으로 204 가 반환된다는 가정이 들어감
    delete: async (path: string): Promise<void> => {
        await request(path, { method: "DELETE" });
    },
};
