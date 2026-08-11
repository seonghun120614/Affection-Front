import React, { InputHTMLAttributes, ReactNode } from "react";

// 기본 input 태그의 모든 속성(type, value, onChange 등)을 상속받습니다.
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string; // 에러 메시지 렌더링용
    rightElement?: ReactNode; // 우측에 들어갈 요소 (중복 확인 버튼 등)
}

export function InputField({
    label,
    error,
    rightElement,
    id,
    className,
    ...props
}: InputFieldProps) {
    // 고유 ID가 주어지지 않으면 label 텍스트를 임시 ID로 사용하여 접근성을 유지합니다.
    const inputId = id || label;

    return (
        <div className="flex w-full flex-col gap-1.5">
            <label
                htmlFor={inputId}
                className="text-sm font-medium text-stone-700"
            >
                {label}
            </label>

            <div className="flex gap-2">
                <input
                    id={inputId}
                    className={`
            w-full rounded-lg border bg-white px-3 py-2.5 text-stone-900 outline-none transition-colors
            border-amber-600/40 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/20
            disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-400
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
            ${className}
          `}
                    {...props} // 명시하지 않은 나머지 모든 속성(placeholder, value 등)을 주입합니다.
                />
                {/* 우측 슬롯에 주입된 컴포넌트가 있다면 렌더링합니다. */}
                {rightElement && <div className="shrink-0">{rightElement}</div>}
            </div>

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
