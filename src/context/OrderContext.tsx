import React, { createContext, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

interface OrderContextType {
    order: any;
    fetchOrder: () => void;
    updateOrderItem: (id: number, quantity: number) => void;
    removeOrderItem: (id: number) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const fetchOrderFromAPI = async (): Promise<any> => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v2/shop/orders/${process.env.REACT_APP_ORDER_TOKEN}`);
    if (!response.ok) {
        throw new Error('Problem z pobieraniem produktów');
    }

    const data = await response.json();

    return data['hydra:member'] || data;
};

const updateOrderItemAPI = async ({ id, quantity }: { id: number; quantity: number }) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v2/shop/orders/${process.env.REACT_APP_ORDER_TOKEN}/items/${id}}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/merge-patch+json" },
        body: JSON.stringify({ 'quantity': quantity })
    });
    if (!response.ok) throw new Error("Nie udało się zmienić ilości produktu");
};

const removeOrderItemAPI = async (id: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v2/shop/orders/${process.env.REACT_APP_ORDER_TOKEN}/items/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Nie udało się usunąć produktu z koszyka");
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: order, refetch } = useQuery({ queryKey: ["order"], queryFn: fetchOrderFromAPI });
    const updateMutation = useMutation({ mutationFn: updateOrderItemAPI, onSuccess: () => refetch() });
    const removeMutation = useMutation({ mutationFn: removeOrderItemAPI, onSuccess: () => refetch() });

    const updateOrderItem = (id: number, quantity: number) => {
        updateMutation.mutate({ id, quantity });
    };

    const removeOrderItem = (id: number) => {
        removeMutation.mutate(id);
    };

    return (
        <OrderContext.Provider value={{ order: order || [], fetchOrder: refetch, updateOrderItem, removeOrderItem }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = (): OrderContextType => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrder must be used within an OrderProvider");
    }
    return context;
};
