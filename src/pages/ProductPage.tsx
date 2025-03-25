import React, { useEffect, useState } from "react";
import Layout from '../layouts/Default';
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import BootstrapAccordion from "../components/Accordion";
import { formatPrice } from "../utils/price";
import { useOrder } from "../context/OrderContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductPage: React.FC = () => {
    const { fetchOrder } = useOrder();
    const { code } = useParams<{ code: string }>();

    const [product, setProduct] = useState<{
        name: string;
        description: string;
        shortDescription: string;
        imageUrl: string;
    } | null>(null);
    const [variant, setVariant] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isAddToCartLoading, setIsAddToCartLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const fetchVariantDetails = async (variantUrl: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}${variantUrl}`);
            if (!response.ok) throw new Error("Nie udało się pobrać wariantu");
            return await response.json();
        } catch (error) {
            console.error("Błąd pobierania wariantu:", error);
            return null;
        }
    };

    const fetchProduct = async () => {
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/v2/shop/products/${code}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Błąd pobierania produktu: ${response.status}`);
            const data = await response.json();

            setProduct({
                name: data.name,
                description: data.description || "Brak opisu",
                shortDescription: data.shortDescription || "Brak krótkiego opisu",
                imageUrl: data.images?.[0]?.path || "https://via.placeholder.com/400"
            });

            const variantUrl = data.defaultVariant;
            const variantData = await fetchVariantDetails(variantUrl);
            if (variantData) {
                setVariant(variantData);
            }
        } catch (err: any) {
            console.error("Błąd pobierania produktu:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        setIsAddToCartLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productVariant: variant.code, quantity })
            });
            if (!response.ok) throw new Error("Failed to create order");
            fetchOrder();
        } catch (err) {
            console.error((err as Error).message);
        } finally {
            setIsAddToCartLoading(false);
        }
    };

    useEffect(() => {
        if (!code) {
            setError("Nieprawidłowy kod produktu.");
            setLoading(false);
            return;
        }
        fetchProduct();
    }, [code]);

    if (error) return <p className="text-center text-danger">Błąd: {error}</p>;
    if (!product && !loading) return <p className="text-center text-danger">Produkt nie został znaleziony</p>;

    const accordionItems = product
        ? [
            { title: "Opis produktu", content: product.description },
            { title: "Atrybuty", content: "Tu będą atrybuty produktu..." },
            { title: "Opinie", content: "Tu będą recenzje produktu..." }
        ]
        : [];

    return (
        <Layout>
            <div className="container mt-4 mb-5">
                <Breadcrumbs paths={[
                    { label: "Strona główna", url: "/" },
                    { label: "Produkty", url: "/products" },
                    { label: product?.name || "...", url: `/product/${code}` }
                ]} />

                <div className="row g-3 g-lg-5 mb-6">
                    <div className="col-12 col-lg-7 col-xl-8">
                        <div className="row spotlight-group mb-5">
                            <div className="col pe-lg-5 pe-xxl-5">
                                <div
                                    className="overflow-hidden bg-light rounded-3 position-relative"
                                    style={{width: "100%", paddingTop: "133.33%"}} // proporcje 3:4 (4 / 3 = 133.33%)
                                >
                                    {loading ? (
                                        <Skeleton
                                            style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0}}
                                        />
                                    ) : (
                                        <img
                                            src={product?.imageUrl}
                                            alt={product?.name}
                                            className="img-fluid position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                        />
                                    )}
                                </div>


                            </div>
                        </div>
                        {!loading && <BootstrapAccordion items={accordionItems}/>}
                    </div>

                    <div className="col-12 col-lg-5 col-xl-4 order-lg-1">
                        <div className="sticky-top pt-2">
                            <div className="mb-4">
                                <h1 className="h2 text-break">
                                    {product?.name || ''}
                                </h1>
                            </div>
                            <div className="col-md-auto">
                                <div className="mb-2">
                                    <div className="d-flex gap-3 align-items-center">
                                        <div className="fs-3">
                                            {loading ? (
                                                <Skeleton width={100} />
                                            ) : variant?.price ? (
                                                `$${formatPrice(variant.price)}`
                                            ) : (
                                                "Brak ceny"
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="position-relative my-4">
                                <form>
                                    <div className="mb-4">
                                        <label className='form-label required'>Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={quantity}
                                            min="1"
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-success px-4 py-2"
                                            onClick={handleAddToCart}
                                            disabled={isAddToCartLoading || loading}
                                        >
                                            {isAddToCartLoading ? "Dodawanie..." : "Add to cart"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="mb-3">
                                {(product?.shortDescription || "Brak krótkiego opisu")}
                            </div>
                            {!loading && (
                                <small className="text-body-tertiary">
                                    {product ? product.name.replace(/\s+/g, "_") : ''}
                                </small>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductPage;
