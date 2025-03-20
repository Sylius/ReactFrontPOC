import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../layouts/Default';
import { Product, ProductVariantDetails } from '../types/Product';
import Breadcrumbs from "../components/Breadcrumbs";
import { formatPrice } from "../utils/price";

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [variantsData, setVariantsData] = useState<{ [productId: number]: ProductVariantDetails | null }>({});

    const fetchProducts = async (page: number): Promise<Product[]> => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v2/shop/products?itemsPerPage=9&page=${page}`);
        if (!response.ok) {
            throw new Error('Problem z pobieraniem produktów');
        }

        const data = await response.json();

        // Ustawianie liczby stron na podstawie API lub obliczenie z totalItems
        const totalItems = data['hydra:totalItems'] || data.totalItems || products.length;
        setTotalPages(Math.max(1, Math.ceil(totalItems / 9)));

        return data['hydra:member'] || data.items || data;
    };

    const fetchVariantDetails = async (variantUrl: string):Promise<ProductVariantDetails | null> => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}${variantUrl}`);
            if (!response.ok) throw new Error("Nie udało się pobrać wariantu");

            return await response.json();
        } catch (error) {
            console.error("Błąd pobierania wariantu:", error);
            return null;
        }
    };

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const productsData = await fetchProducts(currentPage);
                setProducts(productsData);

                // Pobieranie wariantów dla każdego produktu
                const variantsMap: { [productId: number]: ProductVariantDetails | null } = {};
                for (const product of productsData) {
                    if (product.variants.length > 0) {
                        const variantUrl = product.variants[0]; // Pobieramy pierwszy wariant
                        const variantData = await fetchVariantDetails(variantUrl);
                        variantsMap[product.id] = variantData;
                    }
                }
                setVariantsData(variantsMap);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <div className="text-center">Ładowanie produktów...</div>;
    if (error) return <div className="text-center text-red-500">Błąd: {error}</div>;

    return (
        <Layout>
            <div className="container mt-4 mb-5">
                <Breadcrumbs paths={[{ label: "Strona główna", url: "/" }, { label: "Katalog produktów", url: "/products" }]} />
                <div className="row mt-5">
                    <div className="col-12 col-lg-3">
                        <div>
                            <div className="d-flex flex-column">
                                <a href="#" className="d-inline-block py-1 link-reset">Kategorie</a>
                                <a href="#" className="d-inline-block py-1 link-reset">Kategorie</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-9">
                        <div className="mb-4">
                            <h1 className="mb-3">Tytuł kategorii</h1>
                            <div>Opis kategorii</div>
                        </div>
                        <div className="row flex-column flex-md-row align-items-end justify-content-end gap-2 gap-md-0 mb-5">
                            <div className="col">
                                <form method="get" action="/">
                                    <div className="input-group">
                                        <input type="text" placeholder='Value' className='form-control-sm form-control'/>
                                        <button className='btn btn btn-outline-secondary btn-sm' type='submit'>
                                            <svg viewBox='0 0 24 24' className='icon'>
                                                <path fill="none" stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0-14 0m18 11l-6-6"></path>
                                            </svg>
                                        </button>
                                        <a href="#" className="btn btn btn-outline-secondary btn-sm">
                                            <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
                                                <path fill="none" stroke="currentColor" stroke-linecap="round"
                                                      stroke-linejoin="round" stroke-width="2"
                                                      d="M18 6L6 18M6 6l12 12"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </form>
                            </div>
                            <div className='col-auto d-flex gap-2'>
                                <div className="dropdown">
                                    <button type="button" className="btn btn-sm dropdown-toggle show border-0"
                                            data-bs-toggle="dropdown" aria-expanded="true">
                                        <span className="text-black-50">Show: </span>9
                                    </button>
                                </div>
                                <div className="dropdown">
                                    <button type="button" className="btn btn-sm dropdown-toggle border-0"
                                            data-bs-toggle="dropdown">
                                        <span className="text-black-50">Sort: </span>by position
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="products-grid">
                            {products.map(product => (
                                <div key={product.id}>
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
                                        {variantsData[product.id] ? (
                                            <>
                                                <span>
                                                    {variantsData[product.id]?.price
                                                        ? `${formatPrice(variantsData[product.id]?.price)} zł`
                                                        : "Brak ceny"}
                                                </span>
                                            </>
                                        ) : (
                                            <span>Ładowanie danych wariantu...</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Paginacja */}
                        <div className="pagination justify-content-center mt-4">
                            {/* Poprzednia strona */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="page-item disabled:bg-gray-200"
                            >
                                Poprzednia
                            </button>

                            {/* Numerowane strony */}
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`page-item ${currentPage === index + 1 ? 'current' : ''}`}

                                >
                                    {index + 1}
                                </button>
                            ))}

                            {/* Następna strona */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="page-item rounded disabled:bg-gray-200"
                            >
                                Następna
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </Layout>
    );
};

export default ProductList;
