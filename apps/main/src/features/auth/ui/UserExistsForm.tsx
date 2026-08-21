"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@affection/ui";
import { useUserExists } from "@/features/auth/model/use-user-exists";

interface UserExistsFormProps {
    onSuccess: (data: string) => void;
}

export function UserExistsForm({ onSuccess }: UserExistsFormProps) {
    const [username, setUsername] = useState("");
    const [searchTarget, setSearchTarget] = useState("");

    const { data: exists, isFetching, isError, isSuccess, refetch } = useUserExists(searchTarget);

    useEffect(() => {
        if (isSuccess && exists === false && searchTarget) {
            onSuccess(searchTarget);
        }
    }, [isSuccess, exists, searchTarget, onSuccess]);

    // 현재 입력값과 마지막으로 조회한 값이 일치하는지 확인
    const isChecked = username === searchTarget;

    const getButtonStatus = () => {
        if (isFetching) return "loading";
        if (isError && isChecked) return "error";
        // 사용 가능한 경우에만 버튼 비활성화
        if (isSuccess && isChecked && exists === false) return "disabled";
        return "default";
    };

    const getInputStatus = () => {
        if (isError && isChecked) return "error";
        // 이미 사용 중인 유저명이면 error 상태로 표시 (수정 가능)
        if (isSuccess && isChecked && exists === true) return "error";
        if (isSuccess && isChecked && exists === false) return "disabled";
        return "default";
    };

    const handleCheckUser = () => {
        if (username.length < 2) return;

        if (username === searchTarget) {
            refetch();
        } else {
            setSearchTarget(username);
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium">유저명</label>
            <div className="w-full flex flex-row items-center gap-2 h-10">
                <div className="flex-1">
                    <Input
                        type="text"
                        value={username}
                        status={getInputStatus()}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="유저명 2자 이상"
                    />
                </div>
                <div className="flex-none h-full top-0">
                    <Button
                        status={getButtonStatus()}
                        onClick={handleCheckUser}
                        /* 사용 가능한 아이디일 때만 버튼 비활성화 */
                        disabled={username.length < 2 || (isSuccess && isChecked && exists === false)}
                    >
                        확인
                    </Button>
                </div>
            </div>

            {isSuccess && isChecked && (
                <p className={`text-xs ${exists ? "text-red-500" : "text-green-600"}`}>
                    {exists ? "이미 사용 중인 유저명입니다." : "사용 가능한 유저명입니다."}
                </p>
            )}
        </div>
    );
}