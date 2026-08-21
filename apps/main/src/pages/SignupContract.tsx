import { Docs } from "@affection/ui";

interface SignupContractPageProps {
    onAgree: () => void;
}

export function SignupContractPage({ onAgree }: SignupContractPageProps) {
    return (
        <Docs
            title="서비스 회원가입 약관"
            subtitle="서비스 이용을 위해 아래 약관에 동의해 주세요."
            isContract={true}
            content={
                <div className="space-y-4">
                    <p>약관 내용...</p>
                </div>
            }
            onSubmitContract={onAgree} // 동의 완료 버튼 클릭 시 onAgree() 실행
        />
    );
}