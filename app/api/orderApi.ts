// // app/api/order.server.ts
// import { Order } from "~/types/Order";
//
// export const pickupCart = async (): Promise<string> => {
//     const API_URL = window.ENV?.API_URL;
//     const response = await fetch(`${API_URL}/api/v2/shop/orders`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({}),
//     });
//
//     if (!response.ok) throw new Error("Failed to create a new cart");
//
//     const data = await response.json();
//     return data.tokenValue;
// };
//
// export const fetchOrderFromAPI = async (token: string): Promise<Order> => {
//     const API_URL = window.ENV?.API_URL;
//     const response = await fetch(`${API_URL}/api/v2/shop/orders/${token}`);
//
//     if (!response.ok) throw new Error("Failed to fetch order");
//
//     const data = await response.json();
//     return data["hydra:member"] || data;
// };
//
// export const updateOrderItemAPI = async ({
//                                              id,
//                                              quantity,
//                                              token,
//                                          }: {
//     id: number;
//     quantity: number;
//     token: string;
// }): Promise<void> => {
//     const API_URL = window.ENV?.API_URL;
//
//     const response = await fetch(
//         `${API_URL}/api/v2/shop/orders/${token}/items/${id}`,
//         {
//             method: "PATCH",
//             headers: { "Content-Type": "application/merge-patch+json" },
//             body: JSON.stringify({ quantity }),
//         }
//     );
//
//     if (!response.ok) throw new Error("Failed to update item quantity");
// };
//
// export const removeOrderItemAPI = async ({
//                                              id,
//                                              token,
//                                          }: {
//     id: number;
//     token: string;
// }): Promise<void> => {
//     const API_URL = window.ENV?.API_URL;
//     const response = await fetch(
//         `${API_URL}/api/v2/shop/orders/${token}/items/${id}`,
//         {
//             method: "DELETE",
//         }
//     );
//
//     if (!response.ok) throw new Error("Failed to remove item from cart");
// };
