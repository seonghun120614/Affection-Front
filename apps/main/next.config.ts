import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // 프론트엔드(Next.js) 서버로 들어오는 /api 로 시작하는 모든 요청을, 백엔드(Spring Boot 등) 서버인 http://localhost:8080/api 로 proxy
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8080/api/:path*",
            },
        ];
    }
};

export default nextConfig;
