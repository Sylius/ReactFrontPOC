import React from 'react';
import Header from './../components/layout/Header';

// @ts-ignore
const Layout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
        </>
    );
}

export default Layout;
