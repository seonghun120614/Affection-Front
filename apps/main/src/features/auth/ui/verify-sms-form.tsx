"use client";

import { useState } from "react";
import { Button, Input } from "@affection/ui";
import { useSendSms } from "@/features/sms/model/use-send-sms";
import { useVerifySms } from "@/features/auth/model/use-verify-sms";

interface VerifySmsFormProps {
    uid: string;
    onSuccess: (data: string) => void;
}

export function VerifySmsForm({ uid, onSuccess }: VerifySmsFormProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);

    const { mutate: sendSms, isPending: isSending, isError: isSendError } = useSendSms();
    const {
        mutate: verifySms,
        isPending: isVerifying,
        isError: isVerifyError,
        isSuccess: isVerified,
        data: resultMessage,
    } = useVerifySms();

    // 하이픈(-) 제거 및 백엔드 정규식 규격(^01[016789]\d{7,8}$) 검증
    const cleanPhoneNumber = phoneNumber.replace(/-/g, "");
    const isValidPhoneNumber = /^01[016789]\d{7,8}$/.test(cleanPhoneNumber);

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

    // 1. SendSmsRequest 타입({ phoneNumber })에 맞춰 발송
    const handleSendCode = () => {
        if (!isValidPhoneNumber || isSending) return;

        sendSms(
            { uid, phoneNumber: cleanPhoneNumber },
            {
                onSuccess: () => {
                    setIsCodeSent(true);
                },
            }
        );
    };

    // 2. VerifyNumberRequest 타입({ uid, phoneNumber, authCode })에 맞춰 검증
    const handleVerifyCode = () => {
        if (authCode.length !== 6 || isVerifying || isVerified) return;

        verifySms(
            { uid, phoneNumber: cleanPhoneNumber, authCode },
            {
                onSuccess: (verifiedUid: string) => {
                    if (verifiedUid) {
                        onSuccess(cleanPhoneNumber);
                    }
                }
            }
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* 휴대폰 번호 발송 영역 */}
            <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium">휴대폰 번호</label>
                <div className="w-full flex flex-row items-center gap-2 h-10">
                    <div className="flex-1">
                        <Input
                            type="tel"
                            value={phoneNumber}
                            disabled={isVerified}
                            status={isSendError ? "error" : isVerified ? "disabled" : "default"}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="01012345678"
                        />
                    </div>
                    <div className="flex-none h-full">
                        <Button
                            status={getSendButtonStatus()}
                            onClick={handleSendCode}
                            cooldownTime={60}
                            disabled={!isValidPhoneNumber || isVerified}
                            onCooldownEnd={() => setIsCodeSent(false)}
                        >
                            {isCodeSent ? "재발송" : "인증요청"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* 인증번호 입력 영역 */}
            {isCodeSent && (
                <div className="flex flex-col gap-2 w-full">
                    <label className="text-sm font-medium">인증번호</label>
                    <div className="w-full flex flex-row items-center gap-2 h-10">
                        <div className="flex-1">
                            <Input
                                type="text"
                                value={authCode}
                                disabled={isVerified}
                                status={isVerifyError ? "error" : isVerified ? "disabled" : "default"}
                                onChange={(e) => setAuthCode(e.target.value)}
                                placeholder="인증번호 6자리"
                                maxLength={6}
                            />
                        </div>
                        <div className="flex-none h-full">
                            <Button
                                status={getVerifyButtonStatus()}
                                onClick={handleVerifyCode}
                                disabled={authCode.length !== 6 || isVerified}
                            >
                                {isVerified ? "완료" : "확인"}
                            </Button>
                        </div>
                    </div>

                    {isVerifyError && (
                        <p className="text-xs text-red-500 font-medium">
                            인증번호가 일치하지 않거나 만료되었습니다.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}