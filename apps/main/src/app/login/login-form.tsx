"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, LoginRequest } from "@/lib/auth-api";
import { ApiError } from "@/lib/core/ApiError";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);

    try {
      // 백엔드가 Set-Cookie로 JWT를 내려준다. 프론트는 토큰을 저장하지 않는다.
      // CustomUsernamePasswordFilter가 { username, password } JSON을 파싱한다.
      const req: LoginRequest = {
        username: username,
        password: password
      }
      const data = await auth.login(req);

      sessionStorage.setItem("uid", data.uid);
      sessionStorage.setItem("username", data.username);

      const next = searchParams.get("next") ?? "/rooms";
      router.push(next);
      router.refresh(); // 서버 컴포넌트를 다시 그려 로그인 상태를 반영
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-zinc-700">
          닉네임
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "로그인하는 중…" : "로그인"}
      </button>
    </form>
  );
}