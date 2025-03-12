import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProductsList from './components/ProductsList';
import { Product } from './types/Product';

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch('http://localhost/api/v2/shop/products?itemsPerPage=4');

  if (!response.ok) {
    throw new Error('Problem z pobieraniem produktów');
  }

  const data = await response.json();
  return data['hydra:member'] || data.items || data;
};

const App: React.FC = () => {
  const { data: products, isLoading, isError, error } = useQuery<Product[], Error>({
    queryKey: ['products', 'homepage'],
    queryFn: fetchProducts,
  });

  return (
      <div className="container py-5">
        <h1 className="text-center mb-4">Witamy w sklepie Sylius!</h1>

        {isLoading && <div className="text-center">Ładowanie produktów...</div>}
        {isError && <div className="text-danger text-center">Błąd: {error.message}</div>}

        {products && <ProductsList products={products} />}
      </div>
  );
};

export default App;