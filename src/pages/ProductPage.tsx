import React, { useEffect, useState } from "react";
import Layout from '../layouts/Default';
import { useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import BootstrapAccordion from "../components/Accordion"; // 🔥 Teraz mamy Bootstrapa!
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import {formatPrice} from "../utils/price";

const ProductPage: React.FC = () => {
    const { code } = useParams<{ code: string }>();
    const [product, setProduct] = useState<{
        name: string;
        description: string;
        shortDescription: string;  // 🔥 Dodane!
        imageUrl: string;
    } | null>(null);
    const [variant, setVariant] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (!code) {
            setError("Nieprawidłowy kod produktu.");
            setLoading(false);
            return;
        }

        const fetchVariantDetails = async (variantUrl: string) => {
            try {
                console.log("Fetching variant from:", variantUrl);
                const response = await fetch(`${process.env.REACT_APP_API_URL}${variantUrl}`);
                if (!response.ok) throw new Error("Nie udało się pobrać wariantu");

                const variantData = await response.json();
                console.log("Variant data:", variantData);

                return variantData;
            } catch (error) {
                console.error("Błąd pobierania wariantu:", error);
                return null;
            }
        };

        const fetchProduct = async () => {
            const apiUrl = `http://127.0.0.1:8000/api/v2/shop/products/${code}`;
            console.log("Fetching product from:", apiUrl);

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`Błąd pobierania produktu: ${response.status}`);

                const data = await response.json();
                console.log("Product data:", data);

                setProduct({
                    name: data.name,
                    description: data.description || "Brak opisu",
                    shortDescription: data.shortDescription || "Brak krótkiego opisu",  // 🔥 Dodane!
                    imageUrl: data.images?.[0]?.path || "https://via.placeholder.com/400"
                });

                if (data.variants.length > 0) {
                    const variantUrl = data.variants[0];
                    const variantData = await fetchVariantDetails(variantUrl);
                    if (variantData) {
                        setVariant(variantData);
                    }
                }
            } catch (err: any) {
                console.error("Błąd pobierania produktu:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [code]);

    if (loading) return <p className="text-center">Ładowanie produktu...</p>;
    if (error) return <p className="text-center text-danger">Błąd: {error}</p>;
    if (!product) return <p className="text-center text-danger">Błąd: Produkt nie został znaleziony</p>;

    // 🔥 Konfiguracja Accordion
    const accordionItems = [
        { title: "Opis produktu", content: product.description },
        { title: "Atrybuty", content: "Tu będą atrybuty produktu..." },
        { title: "Opinie", content: "Tu będą recenzje produktu..." }
    ];

    return (
        <Layout>
        <div className="container mt-4 mb-5">
            <Breadcrumbs paths={[
                { label: "Strona główna", url: "/" },
                { label: "Produkty", url: "/products" },
                { label: product.name, url: `/product/${code}` }
            ]} />

            <div className="row g-3 g-lg-5 mb-6">
                <div className="col-12 col-lg-7 col-xl-8">
                    <div className="row spotlight-group mb-5">
                        <div className="col pe-lg-5 pe-xxl-5">
                            <img src={product.imageUrl} alt={product.name} className="img-fluid w-100 h-100 object-fit-cover"/>
                        </div>
                    </div>
                    {/* 🔥 Bootstrappowy Accordion */}
                    <BootstrapAccordion items={accordionItems} />
                </div>

                <div className="col-12 col-lg-5 col-xl-4 order-lg-1">
                    <div className="sticky-top pt-2">
                        <div className="mb-4">
                            <h1 className="h2 text-break">{product.name}</h1>
                        </div>
                        <div className="col-md-auto">
                            <div className="mb-2">
                                <div className="d-flex gap-3 align-items-center">
                                    <div className="fs-3">
                                        {variant?.price ? `$ ${formatPrice(variant.price)}` : "Brak ceny"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="position-relative">
                            <div className="my-4">
                                <form action="">
                                    <div className="mb-4">
                                        <div className="field mb-3 required">
                                            <label htmlFor="" className='form-label required'>
                                                Quantity
                                            </label>
                                            <input type="number" className="form-control" value={quantity} min="1"
                                                   onChange={(e) => setQuantity(parseInt(e.target.value))}/>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <button type="button" className="btn btn-success px-4 py-2">Add to cart</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="buttons-container">
                            <button type="button" className="btn btn-warning px-4 py-2 w-100 mb-1">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                     alt="PayPal" width="70"/>
                                Checkout
                            </button>
                        </div>
                        <div className="mb-3">
                            {product.shortDescription ? product.shortDescription : "Brak krótkiego opisu"}
                        </div>
                        <small className="text-body-tertiary">
                            {product.name.replace(/\s+/g, "_")}
                        </small>
                    </div>
                </div>
            </div>
        </div>
        </Layout>
    );
};

export default ProductPage;
