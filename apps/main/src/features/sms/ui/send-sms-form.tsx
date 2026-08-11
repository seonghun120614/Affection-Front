"use client";

import { useState } from "react";
import { useSendSms } from "../model/use-send-sms"; // 훅 경로에 맞게 조정

export function SendSmsForm() {
    const [uid, setUid] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isSent, setIsSent] = useState(false);

    // TanStack Query 기반 useSendSms 훅 바인딩
    const { mutate: sendSms, isPending } = useSendSms();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        sendSms(
            { uid, phoneNumber },
            {
                onSuccess: () => {
                    setIsSent(true);
                    alert("인증번호가 전송되었습니다.");
                },
                onError: () => {
                    alert(
                        "문자 전송에 실패했습니다. 입력 정보를 확인해주세요.",
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
                    UID
                </label>
                <input
                    type="text"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    required
                    placeholder="UID를 입력하세요"
                    className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                    전화번호
                </label>
                <div className="flex gap-2">
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="01012345678"
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
                              : "인증번호 전송"}
                    </button>
                </div>
            </div>

            {isSent && (
                <p className="text-xs text-green-600 font-medium">
                    인증번호가 성공적으로 전송되었습니다.
                </p>
            )}
        </form>
    );
}
