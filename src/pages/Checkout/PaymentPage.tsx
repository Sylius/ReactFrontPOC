import { type FC, useState } from 'react';

import CheckoutLayout from '@/layouts/Checkout';
import { Link } from 'react-router';
import { useOrder } from '@/context/OrderContext';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Steps from '@/components/checkout/Steps';
import GooglePay from '@/components/checkout/payments/GooglePay';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const PaymentPage: FC = () => {
  const { order, fetchOrder } = useOrder();
  const navigate = useNavigate();

  const fetchPaymentMethodsFromAPI = async (): Promise<any> => {
    const response = await fetch(
      `/api/v2/shop/orders/${localStorage.getItem('orderToken')}/payments/${
        order?.payments[0].id
      }/methods`,
    );
    if (!response.ok) {
      throw new Error('Problem fetching payment methods');
    }

    const data = await response.json();

    return data['hydra:member'] || data;
  };

  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: fetchPaymentMethodsFromAPI,
    enabled: order !== null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/v2/shop/orders/${localStorage.getItem('orderToken')}/payments/${
          order.payments[0].id
        }`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/merge-patch+json' },
          body: JSON.stringify({
            paymentMethod: paymentMethod ? paymentMethod : order.payments[0].method,
          }),
        },
      );

      if (!response.ok) {
        setHasErrors(true);
        throw new Error('Failed to submit the payment method');
      }

      await fetchOrder();
      navigate('/checkout/complete');
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutLayout>
      <div className='col-12 col-lg-7 pt-4 pb-5'>
        <div className='pe-lg-6'>
          <Steps activeStep='payment' />

          <div
            data-controller='live'
            data-live-name-value='sylius_shop:checkout:payment:form'
            data-live-url-value='/en_US/_components/sylius_shop:checkout:payment:form'
            id='live-1350467424-0'
            data-live-props-value='{"formName":"sylius_shop_checkout_select_payment","sylius_shop_checkout_select_payment":{"payments":[{"method":"PAYPAL"}],"_token":"94004cb8ac3ba863cf595d182c94.2y-5_TCUgzXIHaEJekeoHH5ZBmWaFi5Sfn-_74xBpTI.vhz8tVam53uDV-RkSQr_akg4QDy3T0UXIRPT3eYMkXiuf5SIVMvHfLx61g"},"isValidated":false,"validatedFields":[],"template":"@SyliusShop\/checkout\/select_payment\/content\/form.html.twig","resource":67322,"hookableMetadata":{"renderedBy":"sylius_shop.checkout.select_payment.content","configuration":"[]","prefixes":["sylius_shop.checkout.select_payment.content","sylius_shop.base.select_payment.content"]},"@attributes":{"id":"live-1350467424-0"},"@checksum":"1Ah5w+xgxumTPXJpFwWJcFXGiO2a32FU0lqM2qF8zo4="}'
          >
            <form
              name='sylius_shop_checkout_select_payment'
              method='post'
              action='/en_US/checkout/select-payment'
              onSubmit={handleSubmit}
              noValidate={true}
            >
              <input type='hidden' name='_method' value='PUT' />

              <h5 className='mb-4'>Payment #1</h5>

              <div className='mb-5'>
                {hasErrors && (
                  <div className='invalid-feedback d-block'>Please select payment method.</div>
                )}
                {paymentMethods?.map((method: any) => (
                  <div className='card bg-body-tertiary border-0 mb-3' key={method.id}>
                    <label className='card-body'>
                      <div>
                        <div className='form-check'>
                          <input
                            type='radio'
                            id='sylius_shop_checkout_select_payment_payments_0_method_1'
                            name='sylius_shop_checkout_select_payment[payments][0][method]'
                            required={true}
                            className='form-check-input'
                            onChange={() => setPaymentMethod(method.code)}
                            checked={paymentMethod === method.code}
                            value={method.code}
                          />
                          <label
                            className='form-check-label required'
                            htmlFor='sylius_shop_checkout_select_payment_payments_0_method_1'
                          >
                            {method.name}
                          </label>
                        </div>
                      </div>

                      <div className='ps-4'>
                        <small className='text-black-50'>{method.description}</small>
                      </div>
                    </label>
                  </div>
                ))}
                <GooglePay submitFunction={handleSubmit} />
              </div>

              <div className='d-flex justify-content-between flex-column flex-sm-row gap-2'>
                <Link className='btn btn-light btn-icon' to='/checkout/select-shipping'>
                  <IconChevronLeft stroke={2} />
                  Change shipping method
                </Link>

                <button type='submit' className='btn btn-primary btn-icon' disabled={isSubmitting}>
                  Next
                  <IconChevronRight stroke={2} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default PaymentPage;
