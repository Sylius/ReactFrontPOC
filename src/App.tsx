import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router";

import ProductPage from "./pages/ProductPage/ProductPage";
import Homepage from './pages/Homepage';
import CartPage from './pages/CartPage';

import './assets/scss/main.scss';

const App: React.FC = () => {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
        </Routes>
    </Router>
  );
};

export default App;
