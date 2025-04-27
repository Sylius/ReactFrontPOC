import { type FC, useState } from 'react';
import Steps from '@/components/checkout/Steps';
import { useOrder } from '@/context/OrderContext';
import CheckoutLayout from '@/layouts/Checkout';
import { formatPrice } from '@/utils/price';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '@/utils/apiFetch';

const ShippingPage: FC = () => {
  const { order } = useOrder();
  const navigate = useNavigate();

  const fetchShippingMethodsFromAPI = async (): Promise<any> => {
    const response = await apiFetch(
      `/api/v2/shop/orders/${localStorage.getItem('orderToken')}/shipments/${order?.shipments[0].id}/methods`,
    );
    if (!response.ok) {
      throw new Error('Problem fetching shipping methods');
    }

    const data = await response.json();

    return data['hydra:member'] || data;
  };

  const { data: shippingMethods } = useQuery({
    queryKey: ['shipping-methods'],
    queryFn: fetchShippingMethodsFromAPI,
    enabled: order !== null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiFetch(
        `/api/v2/shop/orders/${localStorage.getItem('orderToken')}/shipments/${order.shipments[0].id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/merge-patch+json' },
          body: JSON.stringify({ shippingMethod }),
        },
      );

      if (!response.ok) {
        setHasErrors(true);
        throw new Error('Nie udało się wysłać metody dostawy');
      }

      navigate('/checkout/select-payment');
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutLayout>
      <div className='col-12 col-lg-7 pt-4 pb-5'>
        <div>
          <Steps activeStep='shipping' />

          <div className='pe-lg-6'>
            <form
              name='sylius_shop_checkout_select_shipping'
              method='post'
              noValidate={true}
              onSubmit={handleSubmit}
            >
              <input type='hidden' name='_method' value='PUT' />

              <h5 className='mb-4'>Shipment #1</h5>

              <div className='mb-5'>
                {hasErrors && (
                  <div className='invalid-feedback d-block'>Please select shipping method.</div>
                )}
                {shippingMethods.map((method: any) => (
                  <div key={method.id} className='card bg-body-tertiary border-0 mb-3'>
                    <label className='d-flex gap-3 card-body'>
                      <div className='flex-grow-1'>
                        <div>
                          <div className='form-check'>
                            <input
                              type='radio'
                              id={`shipping-method-${method.id}`}
                              name='shipping-methods'
                              required={true}
                              className='form-check-input'
                              onChange={() => setShippingMethod(method.code)}
                              checked={shippingMethod === method.code}
                              value={method.code}
                            />
                            <label
                              className='form-check-label required'
                              htmlFor='sylius_shop_checkout_select_shipping_shipments_0_method_0'
                            >
                              {method.name}
                            </label>
                          </div>
                        </div>

                        <div className='ps-4'>
                          <small className='text-black-50'>{method.description}</small>
                        </div>
                      </div>

                      <div>{formatPrice(method.price)}</div>
                    </label>
                  </div>
                ))}
              </div>

              <div className='d-flex justify-content-between flex-column flex-sm-row gap-2'>
                <Link className='btn btn-light btn-icon' to='/checkout/address'>
                  <svg
                    viewBox='0 0 24 24'
                    className='icon icon-sm flex-shrink-0'
                    aria-hidden='true'
                  >
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m15 6l-6 6l6 6'
                    />
                  </svg>
                  Change address
                </Link>

                <button type='submit' disabled={isSubmitting} className='btn btn-primary btn-icon'>
                  Next{' '}
                  <svg viewBox='0 0 24 24' className='icon icon-sm' aria-hidden='true'>
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m9 6l6 6l-6 6'
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default ShippingPage;
