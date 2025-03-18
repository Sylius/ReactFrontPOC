import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types/Product';

interface ProductsListProps {
    products: Product[];
}

const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
    return (
        <div className="row">
            {products.map(product => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3 mb-4">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default ProductsList;
