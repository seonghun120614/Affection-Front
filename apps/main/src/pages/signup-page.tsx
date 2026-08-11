import { useState } from "react";
import { UserExistsForm, useUserExists } from "@/features";

export function SignupPage() {
    const [username, setUsername] = useState("");

    const {
        data: validUsername,
        refetch: existsUsername,
        isLoading,
    } = useUserExists(username);

    const canSubmit = validUsername === true;

    return (
        <div>
            <UserExistsForm
                username={username}
                onChangeUsername={setUsername}
                validUsername={validUsername}
                onCheckExists={() => existsUsername()}
                isLoading={isLoading}
            />
            <button disabled={!canSubmit}>다음 단계</button>
        </div>
    );
}
