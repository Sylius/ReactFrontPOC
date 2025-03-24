export interface Product {
    id: number;
    slug: string;
    name: string;
    code: string;
    description: string;
    shortDescription: string;
    variants: string[];
    images: Image[];
}

export interface ProductVariantDetails {
    id: number;
    price: number;
    code: string;
}

export interface Image {
    id: number;
    path: string;
}
