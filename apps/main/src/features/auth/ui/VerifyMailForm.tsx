"use client";

import { useState } from "react";
import { Button, Input } from "@affection/ui";
import { useSendMail } from "@/features/mail/model/use-send-mail";
import { useVerifyMail } from "@/features/auth/model/use-verify-mail";

interface EmailVerificationFormProps {
    username: string;
    onSuccess: (verifiedEmail: string, verifiedUid: string) => void;
}

export function VerifyMailForm({ username, onSuccess }: EmailVerificationFormProps) {
    const [email, setEmail] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);

    const { mutate: sendMail, isPending: isSending, isError: isSendError } = useSendMail();
    const {
        mutate: verifyMail,
        isPending: isVerifying,
        isError: isVerifyError,
        isSuccess: isVerified,
        data: resultMessage,
    } = useVerifyMail();

    const isValidEmail = email.includes("@") && email.includes(".");

    const getSendButtonStatus = () => {
        if (isVerified) return "disabled";
        if (isSending) return "loading";
        if (isSendError) return "error";
        if (isCodeSent) return "coolingdown";
        return "default";
    };

    const getVerifyButtonStatus = () => {
        if (isVerifying) return "loading";
        if (isVerifyError) return "error";
        if (isVerified) return "disabled";
        return "default";
    };

    const handleSendCode = () => {
        if (!isValidEmail || isSending || !username) return;

        sendMail(
            { username, email },
            {
                onSuccess: () => {
                    setIsCodeSent(true);
                },
            }
        );
    };

    const handleVerifyCode = () => {
        if (!authCode || isVerifying || isVerified || !username) return;

        verifyMail(
            { username, email, authCode },
            {
                onSuccess: (verifiedUid) => {
                    if (verifiedUid) {
                        onSuccess(email, verifiedUid);
                    }
                },
            }
        );
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* 이메일 입력 및 요청 영역 */}
            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-xs font-medium text-stone-700">이메일</label>
                <div className="w-full flex flex-row items-center gap-2 h-10">
                    <div className="flex-1">
                        <Input
                            type="email"
                            value={email}
                            disabled={isVerified}
                            status={isSendError ? "error" : isVerified ? "disabled" : "default"}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@affection.com"
                        />
                    </div>
                    <div className="flex-none h-full">
                        <Button
                            status={getSendButtonStatus()}
                            onClick={handleSendCode}
                            cooldownTime={60}
                            disabled={!isValidEmail || isVerified || !username}
                            onCooldownEnd={() => setIsCodeSent(false)}
                        >
                            {isCodeSent ? "재발송" : "요청"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 인증번호 입력 영역 (global.css 공통 클래스 적용) */}
            <div className={`smooth-reveal ${isCodeSent ? "is-open" : ""}`}>
                <div className="smooth-reveal-inner flex flex-col gap-1.5 pt-1">
                    <label className="text-xs font-medium text-stone-700">인증번호</label>
                    <div className="w-full flex flex-row items-center gap-2 h-10">
                        <div className="flex-1">
                            <Input
                                type="text"
                                value={authCode}
                                disabled={isVerified}
                                status={isVerifyError ? "error" : isVerified ? "disabled" : "default"}
                                onChange={(e) => setAuthCode(e.target.value)}
                                placeholder="인증번호 입력"
                            />
                        </div>
                        <div className="flex-none h-full">
                            <Button
                                status={getVerifyButtonStatus()}
                                onClick={handleVerifyCode}
                                disabled={!authCode || isVerified}
                            >
                                {isVerified ? "완료" : "확인"}
                            </Button>
                        </div>
                    </div>
                    {isVerifyError && (
                        <p className="text-xs font-medium text-red-500 mt-0.5">
                            인증번호가 일치하지 않거나 만료되었습니다.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}