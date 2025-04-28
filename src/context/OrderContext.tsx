import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

interface OrderContextType {
  order: any;
  fetchOrder: () => void;
  updateOrderItem: (id: number, quantity: number) => void;
  removeOrderItem: (id: number) => void;
  isFetching: boolean;
  orderToken: string | null;
  setOrderToken: (token: string | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const pickupCart = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to pickup cart');
    }

    const data = await response.json();
    return data.tokenValue;
  } catch (err) {
    console.error((err as Error).message);
  }
};

const fetchOrderFromAPI = async (): Promise<any> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_REACT_APP_API_URL
    }/api/v2/shop/orders/${localStorage.getItem('orderToken')}`
  );
  if (!response.ok) {
    throw new Error('Problem z pobieraniem produktów');
  }

  const data = await response.json();

  return data['hydra:member'] || data;
};

const updateOrderItemAPI = async ({
  id,
  quantity,
}: {
  id: number;
  quantity: number;
}) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_REACT_APP_API_URL
    }/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items/${id}}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({ quantity: quantity }),
    }
  );
  if (!response.ok) throw new Error('Nie udało się zmienić ilości produktu');
};

const removeOrderItemAPI = async (id: number) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_REACT_APP_API_URL
    }/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items/${id}`,
    { method: 'DELETE' }
  );
  if (!response.ok) throw new Error('Nie udało się usunąć produktu z koszyka');
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orderToken, setOrderToken] = useState<string | null>(localStorage.getItem('orderToken') ?? null);

  const {
    data: order,
    refetch,
    isFetching,
  } = useQuery({ queryKey: ['order'], queryFn: async () => {
      if (!orderToken) {
        const newToken = await pickupCart();

        setOrderToken(newToken);
        localStorage.setItem('orderToken', newToken);

        return fetchOrderFromAPI();
      }

      try {
        return await fetchOrderFromAPI();
      } catch (error) {
        console.warn('Invalid token, generating a new order...');
        const newToken = await pickupCart();

        setOrderToken(newToken);
        localStorage.setItem('orderToken', newToken);

        return fetchOrderFromAPI();
      }
    }
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

  const updateOrderItem = (id: number, quantity: number) => {
    updateMutation.mutate({ id, quantity });
  };

  const removeOrderItem = (id: number) => {
    removeMutation.mutate(id);
  };

  return (
    <OrderContext.Provider
      value={{
        order: order || [],
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
