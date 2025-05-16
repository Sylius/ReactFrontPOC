import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import 'react-loading-skeleton/dist/skeleton.css';

import ProductPage from "./pages/ProductPage";
import ProductList from "./pages/ProductList";
import Homepage from "./pages/Homepage";
import CartPage from "./pages/CartPage";
import AddressPage from "./pages/Checkout/AddressPage";
import ShippingPage from "./pages/Checkout/ShippingPage";
import PaymentPage from "./pages/Checkout/PaymentPage";
import SummaryPage from "./pages/Checkout/SummaryPage";
import ThankYouPage from "./pages/Checkout/ThankYouPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/account/DashboardPage";
import OrderHistoryPage from "./pages/account/OrderHistoryPage";
import OrderDetailsPage from "./pages/account/OrderDetailsPage";
import ProfilePage from "./pages/account/ProfilePage.tsx";
import AddressBookPage from "./pages/account/AddressBookPage";
import AddAddressPage from "./pages/account/AddAddressPage";
import EditAddressPage from "./pages/account/EditAddressPage";
import AddReviewPage from "./pages/Product/AddReviewPage";
import ReviewsListPage from "./pages/Product/ReviewsListPage";

import "./assets/scss/main.scss";
import { OrderProvider } from "./context/OrderContext";
import { CustomerProvider } from "./context/CustomerContext";
import ChangePasswordPage from "./pages/account/ChangePasswordPage.tsx";
import { FlashMessagesProvider } from "./context/FlashMessagesContext.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <CustomerProvider>
        <OrderProvider>
          <FlashMessagesProvider>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/:parentCode/:childCode" element={<ProductList />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout/address" element={<AddressPage />} />
              <Route
                path="/checkout/select-shipping"
                element={<ShippingPage />}
              />
              <Route
                path="/checkout/select-payment"
                element={<PaymentPage />}
              />
              <Route path="/checkout/complete" element={<SummaryPage />} />
              <Route path="/order/thank-you" element={<ThankYouPage />} />
              <Route path="/product/:code" element={<ProductPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/account/order-history" element={<OrderHistoryPage />} />
              <Route path="/account/dashboard" element={<DashboardPage />} />
              <Route path="/account/profile/edit" element={<ProfilePage />} />
              <Route
                path="/account/change-password"
                element={<ChangePasswordPage />}
              />
              <Route path="/account/order-history" element={<OrderHistoryPage />} />
              <Route path="/account/orders/:token" element={<OrderDetailsPage />} />
              <Route path="/account/address-book" element={<AddressBookPage />} />
              <Route path="/account/address-book/add" element={<AddAddressPage />} />
              <Route path="/account/address-book/edit/:id" element={<EditAddressPage />} />
              <Route path="/product/:code/review/new" element={<AddReviewPage />} />
              <Route path="/product/:code/reviews" element={<ReviewsListPage />} />
            </Routes>
          </FlashMessagesProvider>
        </OrderProvider>
      </CustomerProvider>
    </Router>
  );
};

export default App;
