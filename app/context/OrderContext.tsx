import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    pickupCart,
    fetchOrderFromAPI,
    updateOrderItemAPI,
    removeOrderItemAPI,
} from '~/api/orderApi';
import { Order } from '~/types/Order';

interface OrderContextType {
    order: Order | null;
    fetchOrder: () => void;
    updateOrderItem: (id: number, quantity: number) => void;
    removeOrderItem: (id: number) => void;
    isFetching: boolean;
    orderToken: string | null;
    setOrderToken: (token: string | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orderToken, setOrderToken] = useState<string | null>(null);
    const [tokenLoaded, setTokenLoaded] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('orderToken');
        if (token) setOrderToken(token);
        setTokenLoaded(true);
    }, []);

    const {
        data: order,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['order'],
        enabled: tokenLoaded,
        queryFn: async () => {
            if (!orderToken) {
                const newToken = await pickupCart();
                setOrderToken(newToken);
                localStorage.setItem('orderToken', newToken);
                return fetchOrderFromAPI(newToken);
            }

            try {
                return await fetchOrderFromAPI(localStorage.getItem('orderToken') || '');
            } catch (error) {
                console.warn('Invalid token, creating new cart...', error);
                const newToken = await pickupCart();
                setOrderToken(newToken);
                localStorage.setItem('orderToken', newToken);
                return fetchOrderFromAPI(newToken);
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateOrderItemAPI,
        onSuccess: () => refetch(),
    });

    const removeMutation = useMutation({
        mutationFn: removeOrderItemAPI,
        onSuccess: () => refetch(),
    });

    useEffect(() => {
        if (orderToken && typeof window !== 'undefined') {
            localStorage.setItem('orderToken', orderToken);
        }
    }, [orderToken]);

    const updateOrderItem = (id: number, quantity: number) => {
        const token = localStorage.getItem('orderToken');
        token && updateMutation.mutate({ id, quantity, token });
    };

    const removeOrderItem = (id: number) => {
        const token = localStorage.getItem('orderToken');
        token && removeMutation.mutate({id, token});
    };

    return (
        <OrderContext.Provider
            value={{
                order: order ?? null,
                fetchOrder: refetch,
                updateOrderItem,
                removeOrderItem,
                isFetching,
                orderToken,
                setOrderToken,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = (): OrderContextType => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
