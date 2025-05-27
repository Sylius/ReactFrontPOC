// src/context/OrderContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    pickupCart,
    fetchOrderFromAPI,
    updateOrderItemAPI,
    removeOrderItemAPI,
} from '../api/orderApi';
import { Order } from '../types/Order';

interface OrderContextType {
    order: Order | null;
    fetchOrder: () => void;
    updateOrderItem: (id: number, quantity: number) => void;
    removeOrderItem: (id: number) => void;
    isFetching: boolean;
    orderToken: string | null;
    setOrderToken: (token: string | null) => void;
    activeCouponCode: string | null;
    setActiveCouponCode: (code: string | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orderToken, setOrderToken] = useState<string | null>(
        localStorage.getItem('orderToken') ?? null
    );

    const [activeCouponCode, setActiveCouponCodeState] = useState<string | null>(() => {
        return localStorage.getItem('activeCouponCode') || null;
    });

    const setActiveCouponCode = (code: string | null) => {
        if (code) {
            localStorage.setItem('activeCouponCode', code);
        } else {
            localStorage.removeItem('activeCouponCode');
        }
        setActiveCouponCodeState(code);
    };

    const {
        data: order,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['order'],
        queryFn: async () => {
            if (!orderToken) {
                const newToken = await pickupCart();
                setOrderToken(newToken);
                localStorage.setItem('orderToken', newToken);
                return fetchOrderFromAPI();
            }

            try {
                return await fetchOrderFromAPI();
            } catch (error) {
                console.warn('Invalid token, creating new cart...', error);
                const newToken = await pickupCart();
                setOrderToken(newToken);
                localStorage.setItem('orderToken', newToken);
                return fetchOrderFromAPI();
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
        if (orderToken) {
            localStorage.setItem('orderToken', orderToken);
        }
    }, [orderToken]);

    useEffect(() => {
        if (order?.promotionCoupon?.code) {
            setActiveCouponCode(order.promotionCoupon.code);
        } else if (order?.orderPromotionTotal !== 0 && !order?.promotionCoupon?.code) {
            const storedCode = localStorage.getItem('activeCouponCode');
            if (storedCode) {
                setActiveCouponCodeState(storedCode);
            }
        } else {
            setActiveCouponCode(null);
        }
    }, [order?.promotionCoupon?.code, order?.orderPromotionTotal]);

    const updateOrderItem = (id: number, quantity: number) => {
        updateMutation.mutate({ id, quantity });
    };

    const removeOrderItem = (id: number) => {
        removeMutation.mutate(id);
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
                activeCouponCode,
                setActiveCouponCode,
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
