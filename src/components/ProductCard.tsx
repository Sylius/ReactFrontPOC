// src/components/product/ProductCard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product, ProductVariantDetails } from "../types/Product";
import { formatPrice } from "../utils/price";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [variant, setVariant] = useState<ProductVariantDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchVariant = async () => {
            if (!product.variants.length) return;
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}${product.variants[0]}`);
                if (!res.ok) throw new Error("Błąd pobierania wariantu");
                const data = await res.json();
                setVariant(data);
            } catch (error) {
                console.error("Błąd ładowania wariantu produktu:", error);
                setVariant(null);
            } finally {
                setLoading(false);
            }
        };

        fetchVariant();
    }, [product]);

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
                {loading ? (
                    <span>Ładowanie ceny...</span>
                ) : variant?.price ? (
                    <span>{formatPrice(variant.price)} zł</span>
                ) : (
                    <span>Brak ceny</span>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
