import { useLoaderData, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import CheckoutLayout from '~/layouts/Checkout';
import { useOrder } from '~/context/OrderContext';
import Steps from '~/components/checkout/Steps';
import { formatPrice } from '~/utils/price';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface ShippingMethod {
  id: number;
  code: string;
  name: string;
  description?: string;
  price: number;
}

export async function loader() {
  return null; // dane i tak pobierane po stronie klienta przez useOrder + fetch w `useEffect`
}

export default function ShippingPage() {
  const { order, fetchOrder } = useOrder();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);

  // 🔄 Załaduj metody wysyłki gdy tylko mamy order i shipment.id
  useState(() => {
    const load = async () => {
      if (!order?.shipments?.[0]?.id) return;

      try {
        const res = await fetch(
            `${window.ENV?.API_URL}/api/v2/shop/orders/${order.tokenValue}/shipments/${order.shipments[0].id}/methods`
        );
        const json = await res.json();
        setShippingMethods(json['hydra:member'] || []);
      } catch (e) {
        console.error('Failed to fetch shipping methods:', e);
      }
    };

    load();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasErrors(false);

    try {
      const res = await fetch(
          `${window.ENV?.API_URL}/api/v2/shop/orders/${order?.tokenValue}/shipments/${order?.shipments?.[0]?.id}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/merge-patch+json' },
            body: JSON.stringify({ shippingMethod }), // ⛔️ tylko metoda wysyłki!
          }
      );

      if (!res.ok) {
        setHasErrors(true);
        return;
      }

      await fetchOrder();
      navigate('/checkout/select-payment');
    } catch (err) {
      console.error('Shipping error:', err);
      setHasErrors(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <CheckoutLayout>
        <div className="col-12 col-lg-7 pt-4 pb-5">
          <Steps activeStep="shipping" />
          <form onSubmit={handleSubmit}>
            <h5 className="mb-4">Shipment #1</h5>

            <div className="mb-5">
              {hasErrors && (
                  <div className="invalid-feedback d-block">
                    Please select shipping method.
                  </div>
              )}

              {shippingMethods.map((method) => (
                  <div key={method.id} className="card bg-body-tertiary border-0 mb-3">
                    <label className="d-flex gap-3 card-body">
                      <div className="flex-grow-1">
                        <div className="form-check">
                          <input
                              type="radio"
                              id={`shipping-method-${method.id}`}
                              name="shipping-methods"
                              required
                              className="form-check-input"
                              onChange={() => setShippingMethod(method.code)}
                              checked={shippingMethod === method.code}
                              value={method.code}
                          />
                          <label
                              className="form-check-label required"
                              htmlFor={`shipping-method-${method.id}`}
                          >
                            {method.name}
                          </label>
                        </div>
                        <div className="ps-4">
                          <small className="text-black-50">
                            {method.description}
                          </small>
                        </div>
                      </div>
                      <div>{formatPrice(method.price)}</div>
                    </label>
                  </div>
              ))}
            </div>

            <div className="d-flex justify-content-between flex-column flex-sm-row gap-2">
              <Link className="btn btn-light btn-icon" to="/checkout/address">
                <IconChevronLeft stroke={2} />
                Change address
              </Link>

              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-icon"
              >
                Next
                <IconChevronRight stroke={2} />
              </button>
            </div>
          </form>
        </div>
      </CheckoutLayout>
  );
}
