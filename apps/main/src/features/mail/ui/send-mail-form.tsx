"use client";

import { useState } from "react";
import { useSendMail } from "../model/use-send-mail";

export function SendMailForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    const { mutate: sendMail, isPending } = useSendMail();

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();

        sendMail(
            { username, email },
            {
                onSuccess: () => {
                    setIsSent(true);
                    alert("인증 메일이 전송되었습니다.");
                },
                onError: () => {
                    alert(
                        "메일 전송에 실패했습니다. 입력 정보를 확인해주세요.",
                    );
                },
            },
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 max-w-sm w-full"
        >
            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                    아이디
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="아이디를 입력하세요"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                    이메일
                </label>
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@email.com"
                        className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={isPending}
                        className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none disabled:opacity-50"
                    >
                        {isPending
                            ? "전송 중..."
                            : isSent
                              ? "재전송"
                              : "메일 전송"}
                    </button>
                </div>
            </div>

            {isSent && (
                <p className="text-xs text-green-600 font-medium">
                    메일이 성공적으로 전송되었습니다.
                </p>
            )}
        </form>
    );
}
