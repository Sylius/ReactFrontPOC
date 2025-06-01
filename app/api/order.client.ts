// ~/api/order.client.ts
import type { Order, OrderItem } from "~/types/Order";
import type { Product, ProductVariantDetails } from "~/types/Product";

const API_URL = window?.ENV?.API_URL || "";

export const pickupCartClient = async (): Promise<string> => {
    const response = await fetch(`${API_URL}/api/v2/shop/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });

    if (!response.ok) throw new Error("Failed to create a new cart");

    const data = await response.json();
    return data.tokenValue;
};

export const fetchOrderFromAPIClient = async (
    token: string,
    withDetails = false
): Promise<Order> => {
    const response = await fetch(`${API_URL}/api/v2/shop/orders/${token}`);
    if (!response.ok) throw new Error("Failed to fetch order");

    const order: Order = await response.json();
    if (!withDetails || !order.items) return order;

    const enrichedItems = await Promise.all(
        order.items.map(async (item: OrderItem) => {
            const variantRes = await fetch(`${API_URL}${item.variant}`);
            const variant: ProductVariantDetails & {
                product: string;
                optionValues: { option: string; value: string }[];
            } = await variantRes.json();

            const productRes = await fetch(`${API_URL}${variant.product}`);
            const product: Product = await productRes.json();

            const optionValuesWithResolvedOptions = await Promise.all(
                (variant.optionValues ?? []).map(async (ov) => {
                    try {
                        const optionRes = await fetch(`${API_URL}${ov.option}`);
                        if (!optionRes.ok) throw new Error();
                        const option = await optionRes.json();
                        return { ...ov, option }; // override option string with object
                    } catch {
                        return ov; // fallback to raw if resolution fails
                    }
                })
            );

            return {
                ...item,
                variant: {
                    ...variant,
                    optionValues: optionValuesWithResolvedOptions,
                    product,
                },
            };
        })
    );

    return { ...order, items: enrichedItems };
};

export const updateOrderItemAPIClient = async ({
                                                   id,
                                                   quantity,
                                                   token,
                                               }: {
    id: number;
    quantity: number;
    token: string;
}): Promise<void> => {
    const response = await fetch(`${API_URL}/api/v2/shop/orders/${token}/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/merge-patch+json" },
        body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("Failed to update item quantity");
};

export const removeOrderItemAPIClient = async ({
                                                   id,
                                                   token,
                                               }: {
    id: number;
    token: string;
}): Promise<void> => {
    const response = await fetch(`${API_URL}/api/v2/shop/orders/${token}/items/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove item from cart");
};
