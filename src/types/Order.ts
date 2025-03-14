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
