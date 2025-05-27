import React from 'react';
import Layout from '../layouts/Default';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProductRow from '../components/cart/ProductRow';
import { Order, OrderItem } from '../types/Order';
import { formatPrice } from '../utils/price';
import { Link } from 'react-router-dom';

const fetchCart = async (): Promise<Order> => {
  const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/orders/${localStorage.getItem('orderToken')}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }

  const data = await response.json();
  return data;
};

const removeCartItem = async (id: number): Promise<void> => {
  const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items/${id}`,
      { method: 'DELETE' }
  );
  if (!response.ok) throw new Error('Failed to remove item from cart');
};

interface UpdateCartItemPayload {
  id: number;
  quantity: number;
}

const updateCartItem = async ({ id, quantity }: UpdateCartItemPayload): Promise<void> => {
  const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/merge-patch+json' },
        body: JSON.stringify({ quantity }),
      }
  );
  if (!response.ok) throw new Error('Failed to update item quantity');
};

const debounce = <T extends unknown[]>(func: (...args: T) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const CartPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: order } = useQuery<Order>({
    queryKey: ['order'],
    queryFn: fetchCart,
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order'] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order'] }),
  });

  const debouncedUpdate = debounce((id: number, quantity: number) => {
    updateMutation.mutate({ id, quantity });
  }, 500);

  return (
      <Layout>
        <div className="container mt-4 mb-5">
          <div className="mb-5">
            <h1>Your shopping cart</h1>
            <div>Edit your items, apply coupon or proceed to the checkout</div>
          </div>
          {order?.items?.length === 0 ? (
              <div className="alert alert-info">
                <div className="fw-bold">Info</div>
                Your cart is empty
              </div>
          ) : (
              <div className="row">
                <div className="col-12 col-xl-8 mb-4 position-relative">
                  <div className="table-responsive">
                    <table className="table align-middle">
                      <thead>
                      <tr>
                        <th style={{ width: '1px' }}></th>
                        <th>Item</th>
                        <th style={{ width: '90px' }} className="text-end text-nowrap">Unit price</th>
                        <th style={{ minWidth: '70px', width: '110px' }} className="text-end">Qty</th>
                        <th style={{ width: '90px' }} className="text-end">Total</th>
                      </tr>
                      </thead>
                      <tbody>
                      {order?.items?.map((orderItem: OrderItem) => (
                          <ProductRow
                              key={orderItem.id}
                              orderItem={orderItem}
                              onRemove={removeMutation.mutate}
                              onUpdate={debouncedUpdate}
                          />
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-12 col-xl-4 ps-xl-5 mb-4">
                  <div className="p-4 bg-light mb-4 rounded-3">
                    <h3 className="mb-4">Summary</h3>
                    <div className="hstack gap-2 mb-2">
                      <div>Items total:</div>
                      <div className="ms-auto text-end">${formatPrice(order?.itemsSubtotal)}</div>
                    </div>
                    <div className="hstack gap-2 mb-2">
                      <div>Estimated shipping cost:</div>
                      <div className="ms-auto text-end">${formatPrice(order?.shippingTotal)}</div>
                    </div>
                    <div className="hstack gap-2 mb-2">
                      <div>Taxes total:</div>
                      <div className="ms-auto text-end">${formatPrice(order?.taxTotal)}</div>
                    </div>
                    <div className="hstack gap-2 border-top pt-4 mt-4">
                      <div className="h5">Order total:</div>
                      <div className="ms-auto h5 text-end">${formatPrice(order?.total)}</div>
                    </div>
                  </div>
                  <div className="d-flex">
                    <Link to="/checkout/address" className="btn btn-primary flex-grow-1">
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
          )}
        </div>
      </Layout>
  );
};

export default CartPage;
