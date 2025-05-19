import React from 'react';
import ProductsList from '../components/ProductsList';
import { useQuery } from '@tanstack/react-query';
import { Product } from '../types/Product';
import Layout from '../layouts/Default';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(
    `${
      import.meta.env.VITE_REACT_APP_API_URL
    }/api/v2/shop/products?itemsPerPage=8`
  );
  if (!response.ok) {
    throw new Error('Error while loading products');
  }

  const data = await response.json();
  return data['hydra:member'] || data.items || data;
};

const Homepage: React.FC = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ['products', 'homepage'],
    queryFn: fetchProducts,
  });

  return (
    <Layout>
      <div className="mb-5">
        <div className="overflow-hidden">
          <div className="d-flex justify-content-center align-items-center position-relative">
            <img
              src={`${
                import.meta.env.VITE_REACT_APP_API_URL
              }/build/shop/images/homepage-banner.8ec389de.webp`}
              width="1920"
              height="793"
              className="img-fluid"
              alt="Home"
            />
            <img
              src={`${
                import.meta.env.VITE_REACT_APP_API_URL
              }/build/shop/images/homepage-banner-logo.6759d0fb.webp`}
              className="position-absolute"
              style={{ maxWidth: '40vw' }}
              alt="New collection"
            />
          </div>
        </div>
      </div>
      <div className="container mb-5">
        {isLoading && <div className="text-center">Loading products...</div>}
        {isError && (
          <div className="text-danger text-center">Error: {error.message}</div>
        )}

        {products && (
          <ProductsList products={products} limit={4} name={'Latest deals'} />
        )}
      </div>
      <div className="container mb-5">
        <div className="mb-5">
          <h2>New collection</h2>
        </div>

        <div className="photo-grid">
          <div className="photo-grid-item-1">
            <img
              src={`${
                import.meta.env.VITE_REACT_APP_API_URL
              }/build/shop/images/homepage-new-collection-photo-1.2b163989.webp`}
              className="object-fit-cover w-100 h-100 rounded-3"
              loading="lazy"
              alt="New collection"
            />
          </div>
          <div className="photo-grid-item-2">
            <img
              src={`${
                import.meta.env.VITE_REACT_APP_API_URL
              }/build/shop/images/homepage-new-collection-photo-2.2c91a0c3.webp`}
              className="object-fit-cover w-100 h-100 rounded-3"
              loading="lazy"
              alt="New collection"
            />
          </div>
          <div className="photo-grid-item-3">
            <img
              src={`${
                import.meta.env.VITE_REACT_APP_API_URL
              }/build/shop/images/homepage-new-collection-photo-3.466a0c4c.webp`}
              className="object-fit-cover w-100 h-100 rounded-3"
              loading="lazy"
              alt="New collection"
            />
          </div>
        </div>
      </div>

      <div className="container">
        {products && (
          <ProductsList
            products={products}
            limit={8}
            name={'Latest products'}
          />
        )}
      </div>
    </Layout>
  );
};

export default Homepage;
