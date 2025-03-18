import React from "react";
import { Product } from "../types/Product";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="card">
            <img
                src={product.images.length > 0 ? product.images[0].path : "https://via.placeholder.com/300"}
                className="card-img-top"
                alt={product.name}
            />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">ID: {product.id}</p>
                <a href={`/product/${product.id}`} className="btn btn-primary">
                    Zobacz więcej
                </a>
            </div>
        </div>
    );
};

export default ProductCard;
