"use-client";

import { InputField } from "@affection/ui";

interface UserExistsFormProps {
    username: string;
    onChangeUsername: (value: string) => void;
    validUsername?: boolean;
    onCheckExists: () => void;
    isLoading: boolean;
}

export function UserExistsForm({
    username,
    onChangeUsername,
    validUsername,
    onCheckExists,
    isLoading,
}: UserExistsFormProps) {
    return (
        <form className="mt-8">
            <InputField
                id="username"
                label="이름"
                value={username}
                onChange={(e) => onChangeUsername(e.target.value)}
                rightElement={
                    <button
                        type="button"
                        onClick={onCheckExists}
                        disabled={validUsername !== undefined && validUsername}
                        className="..."
                    >
                        {isLoading ? "확인 중…" : "중복 확인"}
                    </button>
                }
            />
        </form>
    );
}
