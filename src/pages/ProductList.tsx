import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Layout from '../layouts/Default';
import { Product } from '../types/Product';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import Skeleton from 'react-loading-skeleton';
import ProductToolbar from '../components/taxons/ProductToolbar';

interface TaxonDetails {
    name: string;
    description: string;
    code: string;
    parent?: {
        name: string;
        code: string;
    };
    children?: {
        name: string;
        code: string;
    }[];
}

const ProductList: React.FC = () => {
    const { parentCode, childCode } = useParams<{ parentCode?: string; childCode?: string }>();
    const [searchParams] = useSearchParams();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [taxonDetails, setTaxonDetails] = useState<TaxonDetails | null>(null);
    const [parentTaxon, setParentTaxon] = useState<{ name: string; code: string } | null>(null);

    const taxonCode = childCode || parentCode;
    const API = import.meta.env.VITE_REACT_APP_API_URL;

    const fetchProducts = async (page: number, code: string, queryParams: string): Promise<Product[]> => {
        const baseUrl = `${API}/api/v2/shop/products`;
        const url = `${baseUrl}?itemsPerPage=9&page=${page}&productTaxons.taxon.code=${code}${
            queryParams ? '&' + queryParams : ''
        }`;

        const response = await fetch(url);
        const data = await response.json();
        const totalItems = data['hydra:totalItems'] || 0;
        const fetchedProducts: Product[] = data['hydra:member'] || [];

        setHasMore(page * 9 < totalItems);
        return fetchedProducts;
    };

    const fetchTaxonDetails = async (code: string): Promise<TaxonDetails | null> => {
        const res = await fetch(`${API}/api/v2/shop/taxons/${code}`);
        if (!res.ok) return null;
        const data = await res.json();

        let parentData: TaxonDetails['parent'] = undefined;
        const children: { name: string; code: string }[] = [];

        if (data.parent) {
            const parentRes = await fetch(`${API}${data.parent}`);
            if (parentRes.ok) {
                const parentJson = await parentRes.json();
                parentData = { name: parentJson.name, code: parentJson.code };
                setParentTaxon(parentData);
            }
        } else if (childCode) {
            const allTaxons = await fetch(`${API}/api/v2/shop/taxons`);
            const allJson = await allTaxons.json();
            type TaxonEntry = {
                children?: string[];
                name: string;
                code: string;
            };

            const parent = (allJson['hydra:member'] as TaxonEntry[]).find(t =>
                t.children?.includes(`/api/v2/shop/taxons/${code}`)
            );
            if (parent) {
                parentData = { name: parent.name, code: parent.code };
                setParentTaxon(parentData);
            }
        }

        if (data.children?.length) {
            for (const childUrl of data.children) {
                const childRes = await fetch(`${API}${childUrl}`);
                if (childRes.ok) {
                    const childJson = await childRes.json();
                    children.push({ name: childJson.name, code: childJson.code });
                }
            }
        }

        return {
            name: data.name,
            description: data.description,
            code: data.code,
            parent: parentData,
            children,
        };
    };

    useEffect(() => {
        const loadInitialData = async () => {
            if (!taxonCode) return setError('No taxon code in URL');

            setLoading(true);
            try {
                const [productsData, taxonData] = await Promise.all([
                    fetchProducts(1, taxonCode, searchParams.toString()),
                    fetchTaxonDetails(taxonCode),
                ]);
                setProducts(productsData);
                setTaxonDetails(taxonData);
                setCurrentPage(1);
            } catch {
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [taxonCode, searchParams]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore || !taxonCode) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;
        try {
            const newProducts = await fetchProducts(nextPage, taxonCode, searchParams.toString());
            setProducts(prev => [...prev, ...newProducts]);
            setCurrentPage(nextPage);
        } catch (err) {
            console.error('Error loading more products', err);
        } finally {
            setLoadingMore(false);
        }
    }, [currentPage, taxonCode, hasMore, loadingMore, searchParams]);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollHeight - scrollTop - clientHeight < 300) loadMore();
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    if (error) return <div className="text-danger text-center">{error}</div>;

    const isInChildTaxon = !!childCode && !!taxonDetails?.parent;

    const breadcrumbs = [
        { label: 'Home', url: '/' },
        { label: 'Category', url: '' },
        ...(isInChildTaxon && parentTaxon
            ? [
                { label: parentTaxon.name, url: `/${parentTaxon.code}` },
                { label: taxonDetails?.name || '', url: `/${parentTaxon.code}/${taxonDetails?.code}` },
            ]
            : taxonDetails
                ? [{ label: taxonDetails.name, url: `/${taxonDetails.code}` }]
                : []),
    ];

    return (
        <Layout>
            <div className="container mt-4 mb-5">
                <Breadcrumbs paths={breadcrumbs} />

                <div className="row mt-5">
                    <div className="col-12 col-lg-3">
                        {isInChildTaxon && parentTaxon && (
                            <div className="mb-3">
                                <Link to={`/${parentTaxon.code}`} className="text-decoration-none">
                                    Go level up
                                </Link>
                            </div>
                        )}
                        {!isInChildTaxon && taxonDetails?.children?.length ? (
                            <div className="mb-4">
                                {taxonDetails.children.map(child => (
                                    <div key={child.code}>
                                        <Link to={`/${taxonDetails.code}/${child.code}`} className="text-decoration-none d-block mb-1">
                                            {child.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>

                    <div className="col-12 col-lg-9">
                        <div className="mb-4">
                            <h1 className="mb-3">{loading ? <Skeleton /> : taxonDetails?.name}</h1>
                            <div>{loading ? <Skeleton count={2} /> : taxonDetails?.description || ''}</div>
                        </div>

                        <ProductToolbar />

                        <div className="products-grid">
                            {loading
                                ? Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} height={300} />)
                                : products.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>

                        {loadingMore && (
                            <div className="text-center mt-4">
                                <div className="spinner-border text-primary" role="status" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProductList;
