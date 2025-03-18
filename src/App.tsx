import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";

import ProductList from './pages/ProductList';
import Homepage from './pages/Homepage';
import CartPage from './pages/CartPage';
import AddressPage from "./pages/Checkout/AddressPage";
import ShippingPage from "./pages/Checkout/ShippingPage";

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
            </Routes>
        </OrderProvider>
    </Router>
  );
};

export default App;
