/**
 * 백엔드 검증 규칙과 1:1로 맞춘다.
 * 백엔드가 바뀌면 여기도 바꿔야 한다. (프론트 검증은 UX용, 진짜 검증은 서버가 한다)
 */

/** 백엔드: @Pattern(regexp = "[가-힣]{2,20}") */
export const USERNAME_REGEX = /^[가-힣]{2,20}$/;

export function isValidUsername(value: string): boolean {
    return USERNAME_REGEX.test(value);
}

export function isValidPhone(phone: string): boolean {
    // '-' 유무와 무관하게 숫자만 뽑아 검사: 010/011/016/017/018/019 + 7~8자리
    return /^01[016789]\d{7,8}$/.test(phone.replace(/\D/g, ""));
}

/** 백엔드 @Email 과 대략 맞춘 수준. 정밀 검증은 서버 몫. */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
    return EMAIL_REGEX.test(value);
}

/** 인증번호: @Size(min = 6, max = 6) */
export const AUTH_CODE_LENGTH = 6;

/** 비밀번호 규칙. 각 항목을 개별로 노출해서 UI에 체크리스트로 보여준다. */
export type PasswordChecks = {
    length: boolean;
    letter: boolean;
    digit: boolean;
    special: boolean;
};

export function checkPassword(value: string): PasswordChecks {
    return {
        length: value.length >= 8 && value.length <= 64,
        letter: /[A-Za-z]/.test(value),
        digit: /\d/.test(value),
        special: /[^A-Za-z0-9]/.test(value),
    };
}

export function isValidPassword(value: string): boolean {
    return Object.values(checkPassword(value)).every(Boolean);
}

export const PASSWORD_RULES: { key: keyof PasswordChecks; label: string }[] = [
    { key: "length", label: "8자 이상 64자 이하" },
    { key: "letter", label: "영문 포함" },
    { key: "digit", label: "숫자 포함" },
    { key: "special", label: "특수문자 포함" },
];
