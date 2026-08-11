"use client";

import { InputField } from "@affection/ui";

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
        <form className="mt-8">
            <InputField
                label="email"
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                rightElement={
                    <button
                        type="button"
                        onClick={() => onVerifyMail()}
                        disabled={isVerifiedEmail}
                        className="..."
                    >
                        {isLoading ? "확인 중…" : "중복 확인"}
                    </button>
                }
            />
        </form>
    );
}
