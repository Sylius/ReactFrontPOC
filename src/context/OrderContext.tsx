import { createContext, type FC, useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { apiFetch } from '@/utils/apiFetch';

interface OrderContextType {
  order: any;
  fetchOrder: () => void;
  updateOrderItem: (id: number, quantity: number) => void;
  removeOrderItem: (id: number) => void;
  isFetching: boolean;
  orderToken: string | null;
  setOrderToken: (token: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const pickupCart = async () => {
  try {
    const response = await apiFetch('/api/v2/shop/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error('Failed to pickup cart');
    }

    const data = await response.json();
    return data.tokenValue;
  } catch (err) {
    console.error((err as Error).message);
  }
};

export const fetchOrderFromAPI = async (): Promise<any> => {
  const response = await apiFetch(`/api/v2/shop/orders/${localStorage.getItem('orderToken')}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Problem fetching products');
  }

  const data = await response.json();

  return data['hydra:member'] || data;
};

export const updateOrderItemAPI = async ({
  id,
  quantity,
}: {
  id: number;
  quantity: number;
}) => {
  const response = await apiFetch(
    `/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items/${id}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/merge-patch+json' },
      body: JSON.stringify({ quantity: quantity }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update the quantity of the product');
  }
};

export const removeOrderItemAPI = async (id: number) => {
  const response = await apiFetch(
    `/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items/${id}`,
    { method: 'DELETE' },
  );

  if (!response.ok) {
    throw new Error('Failed to remove item from the cart');
  }
};

export const OrderProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    data: order,
    refetch,
    isFetching,
  } = useQuery({ queryKey: ['order'], queryFn: fetchOrderFromAPI });
  const updateMutation = useMutation({
    mutationFn: updateOrderItemAPI,
    onSuccess: () => refetch(),
  });
  const removeMutation = useMutation({
    mutationFn: removeOrderItemAPI,
    onSuccess: () => refetch(),
  });

  const [orderToken, setOrderToken] = useState<string | null>(null);
  const location = useLocation();

  const checkAndGenerateOrderToken = async () => {
    const existingToken = localStorage.getItem('orderToken');
    if (!existingToken || existingToken === 'undefined') {
      try {
        const newToken = await pickupCart();
        localStorage.setItem('orderToken', newToken);
        setOrderToken(newToken);
        await refetch();
      } catch (error) {
        console.error('Error generating order token:', error);
      }
    } else {
      setOrderToken(existingToken);
    }
  };

  useEffect(() => {
    checkAndGenerateOrderToken();
  }, [location.pathname]);

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
