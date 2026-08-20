"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCooldown(initialSeconds = 0) {
  const [cooldown, setCooldown] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (seconds: number) => {
      clear();
      setCooldown(seconds);
      intervalRef.current = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clear();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clear]
  );

  useEffect(() => clear, [clear]); // 언마운트 시 인터벌 정리

  return { cooldown, start, isActive: cooldown > 0 };
}