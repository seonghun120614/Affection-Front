"use client";

import { InputField, Button } from "@affection/ui";

interface VerifyMailFormProps {
    email: string;
    onChangeEmail: (value: string) => void;
    isVerifiedEmail: boolean;
    onVerifyMail: () => void;
    isLoading: boolean;
}

export default function VerifyMailForm({
    email,
    onChangeEmail,
    isVerifiedEmail,
    onVerifyMail,
    isLoading,
}: VerifyMailFormProps) {
    return (
        <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
            <InputField
                label="이메일"
                type="email"
                placeholder="example@affection.com"
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                disabled={isVerifiedEmail}
                // InputField 내부 variants에서 기본 테두리와 포커스 처리를 담당하므로 className 제거 가능
                rightElement={
                    <Button
                        type="button"
                        variant={isVerifiedEmail ? "secondary" : "primary"}
                        size="sm"
                        isLoading={isLoading}
                        onClick={onVerifyMail}
                        disabled={isVerifiedEmail || !email}
                        className="bg-[var(--color-mustard-gold)] text-stone-900 hover:bg-[var(--color-mustard-yellow)] font-semibold shadow-xs"
                    >
                        {isVerifiedEmail ? "인증 완료" : "중복 확인"}
                    </Button>
                }
            />
        </form>
    );
}