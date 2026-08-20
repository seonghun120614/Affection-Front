"use client";

import { useState } from "react";
import {
    UserExistsForm,
    VerifyMailForm,
    VerifySmsForm,
    useRegister,
} from "@/features";
import { Input, Button } from "@affection/ui";
import { motion } from "framer-motion";

export function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

    // 로직 데이터 State (동일 유지)
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [uid, setUid] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const { mutate: register, isPending: isRegistering, isError: isRegisterError } = useRegister();

    const isValidPassword = password.length >= 8;
    const isPasswordMatch = password === confirmPassword && isValidPassword;

    const handleSubmitSignup = () => {
        if (!isPasswordMatch || isRegistering) return;

        register({
            uid,
            username,
            email,
            phoneNumber,
            password,
        }, {
            onSuccess: () => {
                router.push("/login");
            },
        });
    };

    const progress = (step / 4) * 100;

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
            {/* 1. 최외각 컨테이너를 motion.div + layout 설정하여 크기 변경 시 전체 애니메이션 적용 */}
            <motion.div
                layout
                transition={{
                    layout: { duration: 0.3, ease: "easeInOut" }
                }}
                className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-stone-200/40 overflow-hidden"
            >
                {/* 상단 프로그레스 바 */}
                <motion.div layout className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-autumn-rust h-full transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </motion.div>

                {/* 누적형 폼 필드 레이아웃 */}
                <motion.div layout className="flex flex-col gap-6 w-full">
                    
                    {/* Step 1: 유저명 확인 */}
                    <motion.div layout className="w-full">
                        <UserExistsForm
                            onSuccess={(confirmedUsername: string) => {
                                setUsername(confirmedUsername);
                                if (step < 2) setStep(2);
                            }}
                        />
                    </motion.div>

                    {/* Step 2: 이메일 인증 */}
                    {step >= 2 && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-full pt-4 border-t border-stone-100"
                        >
                            <VerifyMailForm
                                username={username}
                                onSuccess={(verifiedEmail: string, verifiedUid: string) => {
                                    setEmail(verifiedEmail);
                                    setUid(verifiedUid);
                                    if (step < 3) setStep(3);
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Step 3: SMS 인증 */}
                    {step >= 3 && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="w-full pt-4 border-t border-stone-100"
                        >
                            <VerifySmsForm
                                uid={uid}
                                onSuccess={(verifiedPhoneNumber: string) => {
                                    setPhoneNumber(verifiedPhoneNumber);
                                    if (step < 4) setStep(4);
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Step 4: 비밀번호 설정 */}
                    {step >= 4 && (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25 }}
                            className="flex flex-col gap-4 w-full pt-4 border-t border-stone-100"
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs sm:text-sm font-medium text-stone-600">비밀번호</label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="8자 이상 입력"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs sm:text-sm font-medium text-stone-600">비밀번호 확인</label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    status={
                                        confirmPassword && !isPasswordMatch
                                            ? "error"
                                            : "default"
                                    }
                                    placeholder="비밀번호 재입력"
                                />
                                {confirmPassword && !isPasswordMatch && (
                                    <p className="text-xs text-red-500 font-medium">
                                        비밀번호가 일치하지 않거나 8자 미만입니다.
                                    </p>
                                )}
                            </div>

                            <div className="h-10 mt-2">
                                <Button
                                    status={isRegistering ? "loading" : isRegisterError ? "error" : "default"}
                                    disabled={!isPasswordMatch || isRegistering}
                                    onClick={handleSubmitSignup}
                                >
                                    회원가입 완료
                                </Button>
                            </div>

                            {isRegisterError && (
                                <p className="text-xs text-red-500 font-medium text-center">
                                    회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.
                                </p>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}