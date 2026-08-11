import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "Affection — 흩어지지 않는 실시간 채팅",
        template: "%s | Affection",
    },
    description:
        "방을 만들고, 초대하고, 나눈 이야기를 그대로 보관하세요. 실시간 채팅 서비스 Affection.",
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
};

export const features = [
    {
        title: "실시간 근처 채팅",
        body: "검색해도 안나오는 지리적 정보, 이벤트성 정보가 필요할 때 이용해봐요.",
    },
    {
        title: "분실물 찾기",
        body: "잃어버린 물건 혹은 찾은 물건을 지도에 표시하여 모두에게 알려주세요.",
    },
    {
        title: "우산 나눔",
        body: "지도를 기반으로 근처 이웃 혹은 행인들이 비를 맞지 않게 우산을 빌려줘요.",
    },
    {
        title: "계층적 관계",
        body: "아는 사람들과 친한 정도를 설정하여 정보 공유의 정도를 조절해봐요.",
    },
];

export const steps = [
    { title: "방 만들기", body: "주제를 정하고 방을 엽니다." },
    { title: "초대하기", body: "링크 하나로 함께할 사람을 부릅니다." },
    { title: "대화하기", body: "나눈 이야기는 사라지지 않고 쌓입니다." },
];
