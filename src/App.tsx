import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";

import ProductPage from "./pages/ProductPage";
import ProductList from './pages/ProductList';
import Homepage from './pages/Homepage';
import CartPage from './pages/CartPage';
import AddressPage from "./pages/Checkout/AddressPage";

import './assets/scss/main.scss';

const App: React.FC = () => {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/address" element={<AddressPage />} />
        </Routes>
    </Router>
  );
};

export default App;
