import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";

import ProductList from './pages/ProductList';
import Homepage from './pages/Homepage';
import CartPage from './pages/CartPage';
import AddressPage from "./pages/Checkout/AddressPage";
import ShippingPage from "./pages/Checkout/ShippingPage";
import PaymentPage from "./pages/Checkout/PaymentPage";
import SummaryPage from "./pages/Checkout/SummaryPage";

import './assets/scss/main.scss';
import {OrderProvider} from "./context/OrderContext";

const App: React.FC = () => {
    return (
    <Router>
        <OrderProvider>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout/address" element={<AddressPage />} />
                <Route path="/checkout/select-shipping" element={<ShippingPage />} />
                <Route path="/checkout/select-payment" element={<PaymentPage />} />
                <Route path="/checkout/complete" element={<SummaryPage />} />
            </Routes>
        </OrderProvider>
    </Router>
  );
};

export default App;
