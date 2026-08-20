import { Docs } from "@/shared/docs";

export function TermsPage() {
    return (
        <Docs
            title="이용약관"
            subtitle="Affection 서비스 이용을 위한 기본 약관입니다."
            updatedAt="2026.08.20"
            content={
                <div className="space-y-4">
                    <h3 className="font-bold text-stone-900">제 1 조 (목적)</h3>
                    <p>본 약관은 Affection 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적의 할 합니다...</p>
                </div>
            }
        />
    );
}