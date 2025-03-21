// src/components/product/ProductCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Product, ProductVariantDetails } from "../types/Product";
import { formatPrice } from "../utils/price";

interface ProductCardProps {
    product: Product;
    variant: ProductVariantDetails | null;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant }) => {
    return (
        <div>
            <Link to={`/product/${product.code}`} className="link-reset">
                <div className="mb-4">
                    <div className="overflow-auto bg-light rounded-3">
                        <img
                            src={product.images[0]?.path}
                            alt={product.name}
                            className="img-fluid w-100 h-100 object-fit-cover"
                        />
                    </div>
                </div>
                <div className="h6 text-break">{product.name}</div>
            </Link>
            <div>
                {variant ? (
                    <span>{variant.price ? `${formatPrice(variant.price)} zł` : "Brak ceny"}</span>
                ) : (
                    <span>Ładowanie danych wariantu...</span>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
