import React from 'react';

interface LoadingSpinnerProps {
  size?: number;       // 스피너 크기 (px)
  color?: string;      // 선 색상 (Tailwind text- 클래스)
  strokeWidth?: number; // 선 두께
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = 'text-blue-500',
  strokeWidth = 4,
}) => {
  const radius = 20;
  const center = 24;
  const viewBoxSize = center * 2;

  return (
    <div style={{ width: size, height: size }}>
      <svg
        className={`animate-spin ${color} w-full h-full`}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        fill="none"
        xmlns="http://w3.org"
      >
        {/* 배경이 되는 연한 회색 원 (선택 사항) */}
        <circle
          className="opacity-25"
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
        {/* 회전하는 유색 원호 */}
        <circle
          className="opacity-75"
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * radius}
          strokeDashoffset={2 * Math.PI * radius * 0.3} // 30% 열린 형태
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;