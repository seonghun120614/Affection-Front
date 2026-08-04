"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, VerifyEmailRequest, VerifyNumberRequest } from "@/lib/auth-api";
import { user } from "@/lib/user-api";
import { sms, SendSmsRequest } from "@/lib/sms-api";
import { mail, SendMailRequest } from "@/lib/mail-api";
import {
  AUTH_CODE_LENGTH,
  PASSWORD_RULES,
  checkPassword,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidUsername,
} from "@/lib/validation";
import { ApiError } from "@/lib/core/ApiError";

const RESEND_COOLDOWN_MS = 60_000;

// 반복되는 스타일. 개별 필드는 앞뒤에 필요한 유틸리티를 덧붙여 쓴다.
const INPUT_BASE =
  "rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";
const SIDE_BUTTON =
  "shrink-0 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40";

type UsernameStatus = "idle" | "checking" | "available" | "taken";

// ── 재전송 카운트다운 ─────────────────────────────────────────
// setInterval로 숫자를 깎으면 탭이 백그라운드일 때 스로틀링돼서 어긋난다.
// "언제까지"를 저장하고 현재시각과 비교하는 방식이 안전하다.
function useCountdown(until: number | null): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (until === null) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [until]);

  return until === null ? 0 : Math.max(0, Math.ceil((until - now) / 1000));
}

// ── 인증번호 상태 기계 ────────────────────────────────────────
// 이메일/전화 인증은 "전송 → 쿨다운 → 코드 입력 → 확인 → uid 획득"이라는
// 같은 흐름을 공유한다. API 호출만 밖에서 주입한다.
function useVerification({
  send,
  verify,
  sendFailMessage,
  onError,
}: {
  send: () => Promise<void>;
  /** 성공하면 uid(UUID 문자열), 실패하면 204 → null */
  verify: (code: string) => Promise<string | null>;
  sendFailMessage: string;
  onError: (message: string | null) => void;
}) {
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [resendAt, setResendAt] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [uid, setUid] = useState<string | null>(null); // 인증 완료의 증거

  const secondsLeft = useCountdown(resendAt);

  const reset = () => {
    setUid(null);
    setCode("");
    setResendAt(null);
    setFailed(false);
  };

  const sendCode = async () => {
    onError(null);
    setSending(true);
    try {
      await send();
      setResendAt(Date.now() + RESEND_COOLDOWN_MS);
      setCode("");
      setFailed(false);
    } catch (err) {
      onError(err instanceof ApiError ? err.message : sendFailMessage);
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    onError(null);
    setVerifying(true);
    setFailed(false);
    try {
      const result = await verify(code);
      if (result === null) setFailed(true);
      else setUid(result);
    } catch (err) {
      onError(err instanceof ApiError ? err.message : "인증에 실패했습니다.");
    } finally {
      setVerifying(false);
    }
  };

  return {
    code,
    changeCode: (value: string) => {
      setCode(value);
      setFailed(false);
    },
    sending,
    verifying,
    failed,
    uid,
    verified: uid !== null,
    codeSent: resendAt !== null,
    secondsLeft,
    cooling: secondsLeft > 0,
    sendCode,
    verifyCode,
    reset,
  };
}

type Verification = ReturnType<typeof useVerification>;

function sendButtonLabel(v: Verification): string {
  if (v.verified) return "인증 완료";
  if (v.cooling) return `${v.secondsLeft}초 후 재전송`;
  if (v.sending) return "보내는 중…";
  return v.codeSent ? "재전송" : "인증번호 전송";
}

/** 인증번호 입력 + 확인 버튼 한 줄. 전송 후 ~ 인증 완료 전에만 렌더된다. */
function CodeField({
  id,
  verification: v,
  failText,
  hintText,
}: {
  id: string;
  verification: Verification;
  failText: string;
  hintText: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        인증번호
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={AUTH_CODE_LENGTH}
          placeholder="6자리"
          value={v.code}
          onChange={(e) => v.changeCode(e.target.value)}
          aria-invalid={v.failed}
          className={`min-w-0 flex-1 tracking-widest tabular-nums ${INPUT_BASE}`}
        />
        <button
          type="button"
          onClick={v.verifyCode}
          disabled={v.code.length !== AUTH_CODE_LENGTH || v.verifying}
          className={`w-28 ${SIDE_BUTTON}`}
        >
          {v.verifying ? "확인 중…" : "확인"}
        </button>
      </div>
      {v.failed ? (
        <p className="text-xs text-red-600">{failText}</p>
      ) : (
        <p className="text-xs text-zinc-500">{hintText}</p>
      )}
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  // 1단계 — 이름
  const [username, setUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");

  // 2단계 — 이메일 인증
  const [email, setEmail] = useState("");
  const emailV = useVerification({
    send: () => {
      const req: SendMailRequest = {
        username: username,
        email: email
      }
      return mail.sendMail(req);
    },
    verify: (authCode) => {
      const req: VerifyEmailRequest = {
        username: username,
        email: email,
        authCode: authCode
      };
      return auth.verifyEmail(req);
    },
    sendFailMessage: "인증번호를 보내지 못했습니다. 이메일 주소를 확인해주세요.",
    onError: setError,
  });

  // 3단계 — 전화번호 인증 (이메일 인증 후 활성화)
  const [phone, setPhone] = useState("");
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneV = useVerification({
    send: async() => {
      if (!emailV.uid) {
        throw new Error("이메일 인증을 먼저 완료해주세요.");
      }

      const req: SendSmsRequest = {
        uid: emailV.uid,
        phoneNumber: phoneDigits,
      }
      await sms.sendSms(req)
    },
    verify: async (authCode) => {
      if (!emailV.uid) {
        throw new Error("이메일 인증을 먼저 완료해주세요.");
      }

      const req: VerifyNumberRequest = {
        uid: emailV.uid,
        phoneNumber: phoneDigits,
        authCode: authCode
      }
      return await auth.verifyNumber(req);
    },
    sendFailMessage: "인증번호를 보내지 못했습니다. 전화번호를 확인해주세요.",
    onError: setError,
  });

  // 4단계 — 비밀번호
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // ── 파생 상태 ───────────────────────────────────────────────
  const usernameValid = isValidUsername(username);
  const usernameOk = usernameValid && usernameStatus === "available";
  const emailValid = isValidEmail(email);
  const phoneValid = isValidPhone(phone);

  const pwChecks = checkPassword(password);
  const pwValid = isValidPassword(password);
  const pwMatch = password.length > 0 && password === passwordConfirm;

  const canSubmit =
    usernameOk &&
    emailV.verified &&
    phoneV.verified &&
    pwValid &&
    pwMatch &&
    !submitting;

  // ── 상태 무효화 ─────────────────────────────────────────────
  // 인증 체인: username → email → phone → password.
  // 상위가 바뀌면 그 하위 인증은 전부 무효다.
  // 이걸 안 하면 "A로 인증받고 B로 가입"이 뚫린다.
  // (emailV.uid는 (username, email) 쌍에 묶여 있다.)
  function handleUsernameChange(value: string) {
    setUsername(value);
    setUsernameStatus("idle");
    emailV.reset();
    phoneV.reset();
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    emailV.reset();
    phoneV.reset();
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    phoneV.reset();
  }

  // ── 액션 ────────────────────────────────────────────────────
  async function checkUsername() {
    setError(null);
    setUsernameStatus("checking");
    user.exists(encodeURIComponent(username))
        .then((exists) => {
          setUsernameStatus(exists ? "taken" : "available");
        })
        .catch((err) => {
          setUsernameStatus("idle");
          setError(err instanceof ApiError ? err.message : "중복 확인에 실패했습니다.");
        });
  }

  async function handleSubmit(e: React.FormEvent) { // Note: 통상적으로 React.FormEvent를 사용합니다.
    e.preventDefault();
    
    // 🔥 phoneV.uid가 존재하는지 직접 체크하여 컴파일러를 안심시킵니다.
    if (!canSubmit || !phoneV.uid) return;

    setError(null);
    setSubmitting(true);
    try {
      await user.register({
        uid: phoneV.uid, // 이제 string으로 완벽히 추론됩니다.
        username,
        email,
        phoneNumber: phoneDigits,
        password,
      });
      router.push("/login?signup=success");
    } catch (err) {
      console.error("실제 에러 원인:", err);
      setError(
        err instanceof ApiError
          ? err.message
          : "가입에 실패했습니다. 잠시 후 다시 시도해주세요.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6" noValidate>
      {/* ───────── 1. 이름 ───────── */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-zinc-700">
          이름
        </label>
        <div className="flex gap-2">
          <input
            id="username"
            type="text"
            autoComplete="name"
            placeholder="한글 2~20자"
            value={username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            aria-invalid={usernameStatus === "taken"}
            className={`min-w-0 flex-1 ${INPUT_BASE}`}
          />
          <button
            type="button"
            onClick={checkUsername}
            disabled={!usernameValid || usernameStatus === "checking"}
            className={SIDE_BUTTON}
          >
            {usernameStatus === "checking" ? "확인 중…" : "중복 확인"}
          </button>
        </div>

        {username.length > 0 && !usernameValid && (
          <p className="text-xs text-red-600">이름은 한글 2~20자여야 합니다.</p>
        )}
        {usernameStatus === "available" && (
          <p className="text-xs text-emerald-600">사용할 수 있는 이름입니다.</p>
        )}
        {usernameStatus === "taken" && (
          <p className="text-xs text-red-600">이미 사용 중인 이름입니다.</p>
        )}
        {usernameValid && usernameStatus === "idle" && (
          <p className="text-xs text-zinc-500">중복 확인을 눌러주세요.</p>
        )}
      </div>

      {/* ───────── 2. 이메일 (이름 확인 후 활성화) ───────── */}
      <fieldset
        disabled={!usernameOk}
        className="flex flex-col gap-1.5 transition-opacity disabled:opacity-40"
      >
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          이메일
        </label>
        <div className="flex gap-2">
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            readOnly={emailV.verified}
            className={`min-w-0 flex-1 read-only:bg-zinc-50 ${INPUT_BASE}`}
          />
          <button
            type="button"
            onClick={emailV.sendCode}
            disabled={
              !emailValid || emailV.sending || emailV.cooling || emailV.verified
            }
            className={`w-28 tabular-nums ${SIDE_BUTTON}`}
          >
            {sendButtonLabel(emailV)}
          </button>
        </div>
        {emailV.verified && (
          <p className="text-xs text-emerald-600">이메일이 인증되었습니다.</p>
        )}
      </fieldset>

      {/* ───────── 2-1. 이메일 인증번호 (전송 후에만 등장) ───────── */}
      {emailV.codeSent && !emailV.verified && (
        <CodeField
          id="emailAuthCode"
          verification={emailV}
          failText="인증번호가 올바르지 않습니다. 메일을 다시 확인해주세요."
          hintText="메일함에서 6자리 인증번호를 확인하세요. 스팸함도 확인해보세요."
        />
      )}

      {/* ───────── 3. 전화번호 (이메일 인증 후 활성화) ───────── */}
      <fieldset
        disabled={!emailV.verified}
        className="flex flex-col gap-1.5 transition-opacity disabled:opacity-40"
      >
        <label htmlFor="phone" className="text-sm font-medium text-zinc-700">
          전화번호
        </label>
        <div className="flex gap-2">
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="'-' 없이 숫자만"
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            readOnly={phoneV.verified}
            className={`min-w-0 flex-1 tabular-nums read-only:bg-zinc-50 ${INPUT_BASE}`}
          />
          <button
            type="button"
            onClick={phoneV.sendCode}
            disabled={
              !phoneValid || phoneV.sending || phoneV.cooling || phoneV.verified
            }
            className={`w-28 tabular-nums ${SIDE_BUTTON}`}
          >
            {sendButtonLabel(phoneV)}
          </button>
        </div>
        {phoneV.verified && (
          <p className="text-xs text-emerald-600">전화번호가 인증되었습니다.</p>
        )}
      </fieldset>

      {/* ───────── 3-1. 전화번호 인증번호 (전송 후에만 등장) ───────── */}
      {phoneV.codeSent && !phoneV.verified && (
        <CodeField
          id="phoneAuthCode"
          verification={phoneV}
          failText="인증번호가 올바르지 않습니다. 문자를 다시 확인해주세요."
          hintText="문자로 받은 6자리 인증번호를 입력하세요."
        />
      )}

      {/* ───────── 4. 비밀번호 (이메일·전화 인증 후에만 등장) ───────── */}
      {emailV.verified && phoneV.verified && (
        <>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={INPUT_BASE}
            />
            <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {PASSWORD_RULES.map(({ key, label }) => {
                const ok = pwChecks[key];
                return (
                  <li
                    key={key}
                    className={`text-xs ${
                      password.length === 0
                        ? "text-zinc-400"
                        : ok
                          ? "text-emerald-600"
                          : "text-zinc-500"
                    }`}
                  >
                    <span aria-hidden className="mr-1">
                      {ok ? "✓" : "·"}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="passwordConfirm"
              className="text-sm font-medium text-zinc-700"
            >
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              aria-invalid={passwordConfirm.length > 0 && !pwMatch}
              className={INPUT_BASE}
            />
            {passwordConfirm.length > 0 &&
              (pwMatch ? (
                <p className="text-xs text-emerald-600">비밀번호가 일치합니다.</p>
              ) : (
                <p className="text-xs text-red-600">
                  비밀번호가 일치하지 않습니다.
                </p>
              ))}
          </div>
        </>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {submitting ? "가입하는 중…" : "가입하기"}
      </button>
    </form>
  );
}
