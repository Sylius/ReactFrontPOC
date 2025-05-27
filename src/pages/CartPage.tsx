// src/pages/CartPage.tsx

import React, { useState } from 'react';
import Layout from '../layouts/Default';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ProductRow from '../components/cart/ProductRow';
import ProductsList from '../components/ProductsList';
import { OrderItem } from '../types/Order';
import { Product } from '../types/Product';
import { formatPrice } from '../utils/price';
import { Link } from 'react-router-dom';
import { IconTrash } from '@tabler/icons-react';
import { useOrder } from '../context/OrderContext';
import Skeleton from 'react-loading-skeleton';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/products?itemsPerPage=4`
  );
  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return data['hydra:member'] || [];
};

const removeCartItem = async (id: number): Promise<void> => {
  const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/orders/${localStorage.getItem(
          'orderToken'
      )}/items/${id}`,
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
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/orders/${localStorage.getItem(
          'orderToken'
      )}/items/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/merge-patch+json' },
        body: JSON.stringify({ quantity }),
      }
  );
  if (!response.ok) throw new Error('Failed to update item quantity');
};

const updateCoupon = async (code: string | null): Promise<void> => {
  const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/orders/${localStorage.getItem(
          'orderToken'
      )}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/ld+json' },
        body: JSON.stringify({ couponCode: code }),
      }
  );
  if (!response.ok) throw new Error('Failed to update coupon');
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
  const [couponInput, setCouponInput] = useState('');
  const { order, isFetching, activeCouponCode, setActiveCouponCode } = useOrder();

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products', 'cart-suggestions'],
    queryFn: fetchProducts,
  });

  const removeMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order'] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order'] }),
  });

  const couponMutation = useMutation({
    mutationFn: updateCoupon,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order'] });
      setActiveCouponCode(variables);
      setCouponInput('');
    },
  });

  const debouncedUpdate = debounce((id: number, quantity: number) => {
    updateMutation.mutate({ id, quantity });
  }, 500);

  if (isFetching || !order) {
    return (
        <Layout>
          <div className="container mt-4 mb-5">
            <h1 className="mb-3">Your shopping cart</h1>
            <Skeleton height={300} />
          </div>
        </Layout>
    );
  }

  const isCouponApplied = !!order?.orderPromotionTotal && order.orderPromotionTotal !== 0;
  const displayCouponCode = order?.promotionCoupon?.code ?? activeCouponCode;

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
                        <th style={{ width: '90px' }} className="text-end text-nowrap">
                          Unit price
                        </th>
                        <th style={{ minWidth: '70px', width: '110px' }} className="text-end">
                          Qty
                        </th>
                        <th style={{ width: '90px' }} className="text-end">
                          Total
                        </th>
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

                  <div className="mb-4">
                    <div className="p-4 bg-light">
                      <div className="input-group field">
                        {isCouponApplied ? (
                            <div className="card d-flex flex-row justify-content-between align-items-center w-100 py-2 px-3">
                              <div className="d-flex flex-wrap" style={{ gap: '.5rem' }}>
                                <span className="me-2">Applied coupon:</span>
                                <span className="badge d-flex align-items-center text-bg-secondary">
                            {displayCouponCode || 'Unknown'}
                          </span>
                              </div>
                              <button
                                  type="button"
                                  className="btn btn-sm btn-transparent d-flex align-items-center p-0"
                                  onClick={() => couponMutation.mutate(null)}
                              >
                                <IconTrash size={16} />
                              </button>
                            </div>
                        ) : (
                            <>
                              <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter your code..."
                                  value={couponInput}
                                  onChange={(e) => setCouponInput(e.target.value)}
                              />
                              <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => couponMutation.mutate(couponInput)}
                              >
                                Apply coupon
                              </button>
                            </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-light"
                        onClick={() => {
                          order?.items?.forEach((item) => {
                            if (item.id !== undefined) removeMutation.mutate(item.id);
                          });
                        }}
                    >
                      Clear cart
                    </button>
                  </div>
                </div>

                <div className="col-12 col-xl-4 ps-xl-5 mb-4">
                  <div className="p-4 bg-light mb-4 rounded-3">
                    <h3 className="mb-4">Summary</h3>
                    <div className="hstack gap-2 mb-2">
                      <div>Items total:</div>
                      <div className="ms-auto text-end">${formatPrice(order?.itemsSubtotal)}</div>
                    </div>
                    {order?.orderPromotionTotal ? (
                        <div className="hstack gap-2 mb-2">
                          <div>Discount:</div>
                          <div className="ms-auto text-end">
                            ${formatPrice(order.orderPromotionTotal)}
                          </div>
                        </div>
                    ) : null}
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

          {products && (
              <div className="mt-5">
                <ProductsList products={products} limit={4} name="You may also like" />
              </div>
          )}
        </div>
      </Layout>
  );
};

export default CartPage;
