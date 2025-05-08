import { type FC, type ReactNode, createContext, useContext, useEffect, useState } from 'react';
import type { Customer } from '@/types/Customer';
import { apiFetch } from '@/utils/apiFetch';

interface CustomerContextType {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  refetchCustomer: () => void;
  clearCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    const token = localStorage.getItem('jwtToken');
    const userUrl = localStorage.getItem('userUrl');
    if (!token || !userUrl) {
      setCustomer(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiFetch(userUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();

      setCustomer(data);
    } catch (err: unknown) {
      setCustomer(null);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load user');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const clearCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userUrl');
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        error,
        refetchCustomer: fetchCustomer,
        clearCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useUser must be used within a CustomerProvider');
  }
  return context;
};
