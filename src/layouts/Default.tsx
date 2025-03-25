import React from 'react';
import Header from './../components/layout/Header';
import Footer from './../components/layout/Footer';
import Navbar from "../components/layout/Navbar";

// @ts-ignore
const Layout = ({ children }) => {
    return (
        <div className={'d-flex flex-column min-vh-100'}>
            <Header />
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}

export default Layout;
