import type { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={'d-flex flex-column min-vh-100'}>
      <Header />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
