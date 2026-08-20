"use client";

import { useState } from "react";
import { Input, Button } from "@affection/ui";
import { useLogin } from "../model/use-login";

export function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: login, isPending, isError } = useLogin();

    const isFormValid = username.trim().length > 0 && password.length > 0;

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!isFormValid || isPending) return;

        login({ username, password });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 w-full">
            {/* 아이디 입력 */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700">
                    유저명
                </label>
                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="유저명 입력"
                />
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-stone-700">
                    비밀번호
                </label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                />
            </div>

            {/* 로그인 제출 버튼 */}
            <div className="h-10 mt-1">
                <Button
                    type="submit"
                    status={isPending ? "loading" : isError ? "error" : "default"}
                    disabled={!isFormValid || isPending}
                >
                    로그인
                </Button>
            </div>
        </form>
    );
}