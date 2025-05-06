import {OneOf} from "../../schema/schema";

export interface OrderItem {
    variant: string;
    productName?: string | null;
    id?: number;
    quantity?: number;
    unitPrice?: number;
    originalUnitPrice?: number | null;
    total?: number;
    discountedUnitPrice?: number;
    subtotal?: number;
}

export interface AddressInterface {
    firstName?: string;
    lastName?: string;
    fullName?: string | null;
    phoneNumber?: string | undefined;
    company?: string | undefined;
    countryCode?: string;
    provinceCode?: string | null;
    provinceName?: string | null;
    street?: string;
    city?: string;
    postcode?: string;
    createdAt?: string;
    updatedAt?: string | null;
    id?: number;
    customer?: string | null;
}

export interface Payment {
    "@id"?: string;
    "@type"?: string;
    id?: number;
    method?: string | null;
}

export interface Shipment {
    "@id"?: string;
    "@type"?: string;
    method?: string;
}

export interface ShippingAddress {
    firstName?: string;
    lastName?: string;
}

export interface Order {
    id?: number;
    number: string;
    tokenValue: string;
    state: string;
    itemsSubtotal: number;
    currencyCode: string;
    shippingAddress?: ShippingAddress;
    payments?: Payment[];
    createdAt?: string;
}
