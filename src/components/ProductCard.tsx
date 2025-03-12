import React from 'react';
import { Product } from '../types/Product';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const imageUrl = product.images[0]?.path
        ? `${product.images[0].path}`
        : 'https://via.placeholder.com/300';

    const variant = product.variants[0];
    // const channelPricing = Object.values(variant.channelPricings)[0];

    return (
        <div className="card h-100">
            <img src={imageUrl} className="card-img-top" alt={product.name} />

            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <div className="mt-auto fw-bold">
                    {/*{(channelPricing.price / 100).toFixed(2)} {channelPricing.channelCode}*/}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;