// ~/routes/cart.tsx

import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {
  useLoaderData,
  useFetcher,
  useLocation,
  Link,
} from "@remix-run/react";
import Layout from "~/layouts/Default";
import { orderTokenCookie } from "~/utils/cookies";
import {
  pickupCart,
  fetchOrderFromAPI,
  updateOrderItemAPI,
  removeOrderItemAPI,
  fetchCartSuggestions,
  applyCouponCode,
  removeCouponCode,
} from "~/api/order.server";
import ProductRow from "~/components/cart/ProductRow";
import ProductsList from "~/components/ProductsList";
import { formatPrice } from "~/utils/price";
import { IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { useOrder } from "~/context/OrderContext";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  let token = await orderTokenCookie.parse(cookieHeader);
  if (!token) token = await pickupCart();

  const [order, products] = await Promise.all([
    fetchOrderFromAPI(token, true),
    fetchCartSuggestions(),
  ]);

  return json(
      { order, token, products },
      {
        headers: {
          "Set-Cookie": await orderTokenCookie.serialize(token),
        },
      }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const token = (await orderTokenCookie.parse(cookieHeader)) ?? "";
  const form = await request.formData();

  const intent = form.get("_intent");
  const id = Number(form.get("id"));
  const quantity = Number(form.get("quantity"));
  const couponCode = form.get("couponCode")?.toString() ?? null;

  try {
    if (intent === "update" && id && quantity >= 0) {
      await updateOrderItemAPI({ id, quantity, token });
    }
    if (intent === "remove" && id) {
      await removeOrderItemAPI({ id, token });
    }
    if (intent === "coupon:add" && couponCode) {
      try {
        await applyCouponCode(token, couponCode);
        return redirect(`/cart?appliedCoupon=${encodeURIComponent(couponCode)}`);
      } catch (e) {
        console.error("Invalid coupon error:", e);
        return redirect("/cart?error=Invalid+coupon");
      }
    }
    if (intent === "coupon:remove") {
      await removeCouponCode(token);
      return redirect("/cart");
    }
  } catch (e) {
    console.error("Cart action error:", e);
  }

  return redirect("/cart");
}

export default function CartPage() {
  const { order, products } = useLoaderData<typeof loader>();
  const { fetchOrder } = useOrder();
  const fetcher = useFetcher();
  const items = order.items ?? [];

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const couponFromQuery = searchParams.get("appliedCoupon");
  const error = searchParams.get("error");

  const isCouponActive = order.orderPromotionTotal < 0;
  const couponCode =
      order.promotionCoupon?.code ??
      (isCouponActive ? localStorage.getItem("appliedCouponCode") : "") ??
      "";

  useEffect(() => {
    if (order.promotionCoupon?.code || isCouponActive) {
      localStorage.setItem(
          "appliedCouponCode",
          order.promotionCoupon?.code ?? "__USED__"
      );
    } else {
      localStorage.removeItem("appliedCouponCode");

      const url = new URL(window.location.href);
      if (url.searchParams.has("appliedCoupon")) {
        url.searchParams.delete("appliedCoupon");
        window.history.replaceState({}, "", url.toString());
      }
    }
  }, [order.promotionCoupon, order.orderPromotionTotal]);

  useEffect(() => {
    if (couponFromQuery) {
      fetchOrder();
    }
  }, [couponFromQuery]);

  return (
      <Layout>
        <div className="container mt-4 mb-5">
          <div className="mb-5">
            <h1>Your shopping cart</h1>
            <div>Edit your items, apply coupon or proceed to the checkout</div>
          </div>

          {items.length === 0 ? (
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
                        <th style={{ width: "1px" }}></th>
                        <th>Item</th>
                        <th style={{ width: "90px" }} className="text-end text-nowrap">Unit price</th>
                        <th style={{ minWidth: "70px", width: "110px" }} className="text-end">Qty</th>
                        <th style={{ width: "90px" }} className="text-end">Total</th>
                      </tr>
                      </thead>
                      <tbody>
                      {items.map((item: any) => (
                          <ProductRow key={item.id} item={item} fetcher={fetcher} />
                      ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mb-4">
                    <div className="p-4 bg-light">
                      {error && <div className="alert alert-danger mb-3">{error}</div>}

                      {couponCode && isCouponActive ? (
                          <fetcher.Form
                              method="post"
                              className="card d-flex flex-row justify-content-between align-items-center w-100 py-1 px-3"
                          >
                            <div className="d-flex flex-wrap">
                              <span className="me-2">Applied coupon:</span>
                              <span className="badge d-flex align-items-center text-bg-secondary">
                          {couponCode === "__USED__" ? "Coupon applied" : couponCode}
                        </span>
                            </div>
                            <button
                                type="submit"
                                name="_intent"
                                value="coupon:remove"
                                className="btn btn-sm btn-transparent d-flex align-items-center"
                                aria-label="Remove coupon"
                            >
                              <IconTrash stroke={1.5} />
                            </button>
                          </fetcher.Form>
                      ) : (
                          <fetcher.Form method="post" className="input-group">
                            <input
                                name="couponCode"
                                className="form-control"
                                placeholder="Enter your code..."
                                aria-label="Coupon code"
                            />
                            <button
                                type="submit"
                                name="_intent"
                                value="coupon:add"
                                className="btn btn-outline-secondary"
                            >
                              Apply coupon
                            </button>
                          </fetcher.Form>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-light"
                        onClick={() => {
                          items.forEach((item) => {
                            if (item.id !== undefined) {
                              fetcher.submit({ id: item.id, _intent: "remove" }, { method: "post" });
                            }
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
                      <div className="ms-auto text-end">${formatPrice(order.itemsSubtotal)}</div>
                    </div>
                    {!!order.orderPromotionTotal && (
                        <div className="hstack gap-2 mb-2">
                          <div>Discount:</div>
                          <div className="ms-auto text-end">{formatPrice(order.orderPromotionTotal)}</div>
                        </div>
                    )}
                    <div className="hstack gap-2 mb-2">
                      <div>Estimated shipping cost:</div>
                      <div className="ms-auto text-end">${formatPrice(order.shippingTotal)}</div>
                    </div>
                    <div className="hstack gap-2 mb-2">
                      <div>Taxes total:</div>
                      <div className="ms-auto text-end">${formatPrice(order.taxTotal)}</div>
                    </div>
                    <div className="hstack gap-2 border-top pt-4 mt-4">
                      <div className="h5">Order total:</div>
                      <div className="ms-auto h5 text-end">${formatPrice(order.total)}</div>
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

          {products?.length > 0 && (
              <div className="mt-5">
                <ProductsList products={products} limit={4} name="You may also like" />
              </div>
          )}
        </div>
      </Layout>
  );
}
