import { RouteObject } from "react-router-dom";
import AddressPage from "../pages/Checkout/AddressPage";
import ShippingPage from "../pages/Checkout/ShippingPage";
import PaymentPage from "../pages/Checkout/PaymentPage";
import SummaryPage from "../pages/Checkout/SummaryPage";
import ThankYouPage from "../pages/Checkout/ThankYouPage";
import PayOrderPage from "../pages/Checkout/PayOrderPage";

export const checkoutRoutes: RouteObject = {
  path: "checkout",
  children: [
    { path: "address", element: <AddressPage /> },
    { path: "select-shipping", element: <ShippingPage /> },
    { path: "select-payment", element: <PaymentPage /> },
    { path: "complete", element: <SummaryPage /> },
  ],
};

export const thankYouRoute: RouteObject = {
  path: "order/thank-you",
  element: <ThankYouPage />,
};

export const payOrderRoute: RouteObject = {
  path: "account/orders/:token/pay",
  element: <PayOrderPage />,
};
