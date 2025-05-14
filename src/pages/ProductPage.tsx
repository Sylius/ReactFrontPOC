import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../layouts/Default';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import BootstrapAccordion from '../components/Accordion';
import { formatPrice } from '../utils/price';
import { useOrder } from '../context/OrderContext';
import Skeleton from 'react-loading-skeleton';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { useFlashMessages } from '../context/FlashMessagesContext';

import {
    Product,
    ProductVariantDetails,
    ProductOption,
    ProductOptionValue,
    ProductAttribute,
} from '../types/Product';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const ProductPage: React.FC = () => {
    const { fetchOrder } = useOrder();
    const { addMessage } = useFlashMessages();
    const { code } = useParams<{ code: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [variant, setVariant] = useState<ProductVariantDetails | null>(null);
    const [options, setOptions] = useState<ProductOption[]>([]);
    const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
    const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
    const [activeImage, setActiveImage] = useState<string | null>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    const fetchOption = async (url: string): Promise<ProductOption> => {
        const res = await fetch(`${API_URL}${url}`);
        const data = await res.json();

        const values: ProductOptionValue[] = await Promise.all(
            data.values.map(async (valueUrl: string) => {
                const res = await fetch(`${API_URL}${valueUrl}`);
                return await res.json();
            })
        );

        return { code: data.code, name: data.name, values };
    };

    const fetchVariantByOptions = async (
        productCode: string,
        selected: Record<string, string>
    ) => {
        const optionParams = Object.entries(selected)
            .map(
                ([optionCode, valueCode]) =>
                    `optionValues[]=/api/v2/shop/product-options/${optionCode}/values/${valueCode}`
            )
            .join('&');
        const fullUrl = `${API_URL}/api/v2/shop/product-variants?product=/api/v2/shop/products/${productCode}&${optionParams}`;
        const res = await fetch(fullUrl);
        const data = await res.json();
        setVariant(data['hydra:member']?.[0] || null);
    };

    const fetchProductAttributes = async (productCode: string) => {
        try {
            const res = await fetch(`${API_URL}/api/v2/shop/products/${productCode}/attributes`);
            if (!res.ok) throw new Error('Failed to fetch product attributes');
            const data = await res.json();
            setAttributes(data['hydra:member'] || []);
        } catch (err) {
            console.error('Error while loading product attributes:', err);
        }
    };

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_URL}/api/v2/shop/products/${code}`);
            const data = await res.json();

            setProduct(data);
            if (data.images?.length > 0) setActiveImage(data.images[0].path);

            if (data.options?.length) {
                const fetchedOptions = await Promise.all(data.options.map(fetchOption));
                setOptions(fetchedOptions);
                const defaultSelections: Record<string, string> = {};
                fetchedOptions.forEach((option) => {
                    defaultSelections[option.code] = option.values[0]?.code;
                });
                setSelectedValues(defaultSelections);
                await fetchVariantByOptions(data.code, defaultSelections);
            } else if (data.defaultVariant) {
                const res = await fetch(`${API_URL}${data.defaultVariant}`);
                const variantData = await res.json();
                setVariant(variantData);
            }

            if (data.code) await fetchProductAttributes(data.code);
        } catch (err) {
            console.error('Error while loading product data:', err);
            setError('Error while loading product data');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (optionCode: string, valueCode: string) => {
        const updated = { ...selectedValues, [optionCode]: valueCode };
        setSelectedValues(updated);
        if (product) fetchVariantByOptions(product.code, updated);
    };

    const handleAddToCart = async () => {
        if (!variant) return;
        setIsAddToCartLoading(true);
        try {
            const response = await fetch(
                `${API_URL}/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productVariant: variant.code, quantity }),
                }
            );
            if (!response.ok) throw new Error('Failed to add to cart');

            fetchOrder();
            addMessage('success', 'Product added to cart');
        } catch (err) {
            console.error(err);
            addMessage('error', 'Failed to add product to cart');
        } finally {
            setIsAddToCartLoading(false);
        }
    };

    useEffect(() => {
        if (code) fetchProduct();
    }, [code]);

    const accordionItems = useMemo(() => {
        if (!product) return [];
        return [
            {
                title: 'Details',
                content: <p>{product.description}</p>,
            },
            {
                title: 'Attributes',
                content: attributes.length > 0 ? (
                    <table className="table table-lg table-list">
                        <tbody>
                        {attributes.map((attr) => (
                            <tr key={attr.id}>
                                <th className="fw-bold py-3 ps-0">{attr.name}</th>
                                <th className="fw-normal py-3">{attr.value}</th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No attributes available.</p>
                ),
            },
            {
                title: 'Reviews (0)',
                content: <p>Reviews will go here...</p>,
            },
        ];
    }, [product, attributes]);

    const lightboxSlides = product?.images.map((img) => ({ src: img.path })) || [];
    const lightboxIndex = Math.max(
        0,
        product?.images.findIndex((img) => img.path === activeImage) ?? 0
    );

    if (error) return <div className="text-danger text-center">{error}</div>;

    return (
        <Layout>
            <div className="container mt-4 mb-5">
                <Breadcrumbs
                    paths={[
                        { label: 'Home', url: '/' },
                        { label: product?.name || '...', url: `/product/${code}` },
                    ]}
                />

                <div className="row g-3 g-lg-5 mb-6">
                    <div className="col-12 col-lg-7 col-xl-8">
                        <div className="row spotlight-group mb-5">
                            {product?.images?.length > 1 && (
                                <div className="col-auto d-none d-lg-block">
                                    <div className="product-thumbnails d-flex flex-column overflow-auto">
                                        {product.images.map((img) => (
                                            <button
                                                key={img.id}
                                                type="button"
                                                onClick={() => setActiveImage(img.path)}
                                                className={`border-0 p-0 bg-transparent rounded overflow-hidden ${
                                                    activeImage === img.path ? 'opacity-100' : 'opacity-50'
                                                }`}
                                            >
                                                <img
                                                    src={img.path}
                                                    alt="thumbnail"
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="col pe-lg-5 pe-xxl-5">
                                <div
                                    className="product-main-image-wrapper overflow-hidden bg-light rounded-3"
                                    onClick={() => setLightboxOpen(true)}
                                >
                                    {loading ? (
                                        <Skeleton style={{ width: '100%', height: '100%' }} />
                                    ) : (
                                        <img
                                            src={activeImage || product?.images[0]?.path}
                                            alt={product?.name}
                                            className="img-fluid w-100 h-100 object-fit-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {!loading && <BootstrapAccordion items={accordionItems} />}
                    </div>

                    <div className="col-12 col-lg-5 col-xl-4 order-lg-1">
                        <div className="sticky-top pt-2">
                            <div className="mb-4">
                                <h1 className="h2 text-wrap">{product?.name}</h1>
                            </div>

                            <div className="fs-3 mb-3">
                                {loading ? (
                                    <Skeleton width={100} />
                                ) : variant?.price ? (
                                    `$${formatPrice(variant.price)}`
                                ) : (
                                    'No price available'
                                )}
                            </div>

                            {options.map((option) => (
                                <div className="mb-3" key={option.code}>
                                    <label className="form-label">{option.name}</label>
                                    <select
                                        className="form-select"
                                        value={selectedValues[option.code]}
                                        onChange={(e) => handleOptionChange(option.code, e.target.value)}
                                    >
                                        {option.values.map((value) => (
                                            <option key={value.code} value={value.code}>
                                                {value.value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            <div className="position-relative my-4">
                                <div className="mb-4">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={quantity}
                                        min="1"
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <button
                                        type="button"
                                        className="btn btn-success px-4 py-2"
                                        onClick={handleAddToCart}
                                        disabled={isAddToCartLoading || loading}
                                    >
                                        {isAddToCartLoading ? 'Adding...' : 'Add to cart'}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                {product?.shortDescription || 'No short description'}
                            </div>

                            <small className="text-body-tertiary">
                                {product?.name.replace(/\s+/g, '_')}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={lightboxSlides}
                index={lightboxIndex}
            />
        </Layout>
    );
};

export default ProductPage;
