import type { FC } from 'react';
import type { Payment } from '@/types/Order';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@/utils/price';
import { apiFetch } from '@/utils/apiFetch';

interface PaymentsCardProps {
  payment: Payment;
  total: number;
}

const PaymentsCard: FC<PaymentsCardProps> = ({ payment, total }) => {
  const fetchPaymentMethodFromAPI = async (): Promise<any> => {
    if (!payment.method) {
      throw new Error('Payment method is missing');
    }
    const response = await apiFetch(payment.method);
    if (!response.ok) {
      throw new Error('Problem fetching the payment method');
    }

    const data = await response.json();

    return data['hydra:member'] || data;
  };

  const { data: paymentMethod } = useQuery({
    queryKey: ['payment-method'],
    queryFn: fetchPaymentMethodFromAPI,
  });

  return (
    <div className='card border-0 bg-body-tertiary mb-3'>
      <div className='card-header d-flex align-items-center'>
        <div className='me-auto'>Payments</div>
      </div>

      <div className='card-body d-flex flex-column gap-2'>
        <div className='d-flex gap-4'>
          <div className='me-auto'>{paymentMethod?.name}</div>

          <div className='fw-medium'>${formatPrice(total)}</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsCard;
