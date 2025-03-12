export interface Product {
    id: number;
    name: string;
    variants: Variant[];
    images: Image[];
}

export interface Variant {
    id: number;
    price: number;
    channelPricings: {
        [channelCode: string]: {
            price: number;
            channelCode: string;
        };
    };
}

export interface Image {
    id: number;
    path: string;
}
