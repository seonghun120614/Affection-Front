export interface CreateFindingRequest {
    title: string;
    desc: string;
    affection: number;
    latitude: number;
    longitude: number;
    address?: string;
}

export interface CreateFoundingRequest {
    title: string;
    img: string;
    desc: string;
    latitude: number;
    longitude: number;
    address?: string;
}