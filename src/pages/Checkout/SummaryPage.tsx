import React, { useEffect, useState } from 'react';

import CheckoutLayout from '../../layouts/Checkout';
import { useOrder } from '../../context/OrderContext';
import Address from '../../components/Address';
import PaymentsCard from '../../components/order/PaymentsCard';
import ShipmentsCard from '../../components/order/ShipmentsCard';
import ProductRow from '../../components/order/ProductRow';
import { OrderItem } from '../../types/Order';
import { formatPrice } from '../../utils/price';
import { useNavigate } from 'react-router-dom';
import Steps from '../../components/checkout/Steps';

const SummaryPage: React.FC = () => {
  const { order, fetchOrder, setOrderToken } = useOrder();
  const navigate = useNavigate();

  const [extraNotes, setExtraNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/api/v2/shop/orders/${localStorage.getItem('orderToken')}/complete`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/merge-patch+json' },
          body: JSON.stringify({ notes: extraNotes }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      setOrderToken(null);
      localStorage.removeItem('orderToken');
      navigate('/order/thank-you');
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return (
    <CheckoutLayout sidebarOn={false}>
      <div className="col pt-4 pb-5">
        <div className="mx-auto">
          <Steps activeStep="complete" />

          <h1 className="h5 mb-4">Summary of your order</h1>

          {order && (
            <div className="card border-0 bg-body-tertiary mb-3">
              <div className="card-body d-flex flex-column gap-1">
                <div className="row">
                  <div className="col-12 col-sm-4">Currency</div>
                  <div className="col">{order.currencyCode}</div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-4">Locale</div>
                  <div className="col d-flex gap-2 align-items-center">
                    {order.localeCode}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form
            name="sylius_checkout_complete"
            onSubmit={handleSubmit}
            noValidate={true}
          >
            <input type="hidden" name="_method" value="PUT" />

            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                {order?.billingAddress && (
                  <Address
                    sectionName="Billing addresss"
                    address={order.billingAddress}
                  />
                )}
              </div>

              <div className="col-12 col-md-6 mb-3">
                {order.shippingAddress && (
                  <Address
                    sectionName={'Shipping address'}
                    address={order.shippingAddress}
                  />
                )}
              </div>
            </div>

            <div className="mb-5">
              {order?.payments && (
                <PaymentsCard
                  payment={order?.payments[0]}
                  total={order?.total}
                />
              )}

              {order?.shipments && (
                <ShipmentsCard shipment={order?.shipments[0]} />
              )}
            </div>

            <div className="table-responsive border-bottom mb-4">
              <table className="table table-borderless table-space align-middle mb-0">
                <thead>
                  <tr>
                    <th
                      className="border-bottom mb-4 pb-4 "
                      data-test-table="item"
                    >
                      Item
                    </th>

                    <th
                      className="border-bottom mb-4 pb-4 text-end"
                      data-test-table="price"
                    >
                      Unit price
                    </th>

                    <th
                      className="border-bottom mb-4 pb-4 text-end"
                      data-test-table="qty"
                    >
                      Qty
                    </th>

                    <th
                      className="border-bottom mb-4 pb-4 text-end"
                      data-test-table="subtotal"
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {order?.items &&
                    order.items.map((orderItem: OrderItem) => (
                      <ProductRow orderItem={orderItem} key={orderItem.id} />
                    ))}
                </tbody>

                <tfoot></tfoot>
              </table>
            </div>

            <table className="table table-borderless align-middle ms-auto mb-6">
              <tbody>
                <tr>
                  <td className="text-end w-75">Items total:</td>

                  <td className="text-end">${formatPrice(order.itemsTotal)}</td>
                </tr>

                <tr>
                  <td className="text-end w-75">Taxes total:</td>

                  <td className="text-end">
                    <div data-test="tax-total">
                      <div className="disabled">
                        ${formatPrice(order.taxTotal)}
                      </div>
                    </div>

                    <div>
                      <small className="text-body-tertiary">
                        Included in price
                      </small>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td className="text-end w-75">Discount:</td>

                  <td className="text-end">
                    ${formatPrice(order.orderPromotionTotal)}
                  </td>
                </tr>

                <tr>
                  <td className="text-end w-75">Shipping total:</td>

                  <td className="text-end">
                    <div>${formatPrice(order.shippingTotal)}</div>
                  </td>
                </tr>

                <tr>
                  <td className="w-75">
                    <div className="h5 text-end border-top pt-4 mt-3">
                      Total:
                    </div>
                  </td>

                  <td>
                    <div className="h5 text-end border-top pt-4 mt-3">
                      ${formatPrice(order.total)}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className=" field mb-3">
              <label
                htmlFor="sylius_checkout_complete_notes"
                className="form-label"
              >
                Extra notes
              </label>
              <textarea
                id="sylius_checkout_complete_notes"
                name="sylius_checkout_complete[notes]"
                className="form-control"
                onChange={(e) => setExtraNotes(e.target.value)}
                value={extraNotes}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                id="confirmation-button"
                disabled={isSubmitting}
              >
                Place order
              </button>
            </div>
          </form>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default SummaryPage;
