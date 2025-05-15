import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layouts/Default';
import { Product } from '../types/Product';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductCard from '../components/ProductCard';
import Skeleton from 'react-loading-skeleton';

interface TaxonDetails {
  name: string;
  description: string;
  code: string;
  parent?: {
    name: string;
    code: string;
  };
}

const ProductList: React.FC = () => {
  const { parentCode, childCode } = useParams<{ parentCode: string; childCode: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [taxonDetails, setTaxonDetails] = useState<TaxonDetails | null>(null);

  const fetchProducts = async (page: number, code: string): Promise<Product[]> => {
    const url = `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/products?itemsPerPage=9&page=${page}&productTaxons.taxon.code=${code}`;
    const response = await fetch(url);
    const data = await response.json();
    const totalItems = data['hydra:totalItems'] || 0;
    const fetchedProducts = data['hydra:member'] || [];

    setHasMore(page * 9 < totalItems);
    return fetchedProducts;
  };

  const fetchTaxonDetails = async (code: string): Promise<TaxonDetails | null> => {
    try {
      const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/taxons/${code}`);
      if (!res.ok) throw new Error('Nie udało się pobrać szczegółów taxona');
      const data = await res.json();

      let parentData = null;
      if (data?.parent) {
        const parentRes = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}${data.parent}`);
        if (parentRes.ok) {
          const parentJson = await parentRes.json();
          parentData = { name: parentJson.name, code: parentJson.code };
        }
      }

      return {
        name: data.name,
        description: data.description,
        code: data.code,
        parent: parentData || undefined,
      };
    } catch (err) {
      console.error('Błąd ładowania danych taxona:', err);
      return null;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!childCode) {
        setError('Brak kodu taxona w URL');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [productsData, taxonData] = await Promise.all([
          fetchProducts(1, childCode),
          fetchTaxonDetails(childCode),
        ]);

        setProducts(productsData);
        setTaxonDetails(taxonData);
        setCurrentPage(1);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [childCode]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !childCode) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;
    try {
      const newProducts = await fetchProducts(nextPage, childCode);
      setProducts(prev => [...prev, ...newProducts]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Błąd przy ładowaniu kolejnych produktów', err);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, childCode, hasMore, loadingMore]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - scrollTop - clientHeight < 300) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  if (error) return <div className="text-center text-danger">Błąd: {error}</div>;

  return (
      <Layout>
        <div className="container mt-4 mb-5">
          <Breadcrumbs
              paths={[
                { label: 'Strona główna', url: '/' },
                ...(taxonDetails?.parent
                    ? [{ label: taxonDetails.parent.name, url: `/${taxonDetails.parent.code}` }]
                    : []),
                { label: taxonDetails?.name || childCode || '', url: `/${parentCode}/${childCode}` },
              ]}
          />

          <div className="row mt-5">
            <div className="col-12 col-lg-3">Filtry</div>

            <div className="col-12 col-lg-9">
              <div className="mb-4">
                <h1 className="mb-3">
                  {loading ? <Skeleton /> : taxonDetails?.name || childCode}
                </h1>
                <div>
                  {loading ? <Skeleton count={2} /> : taxonDetails?.description || 'Brak opisu tej kategorii.'}
                </div>
              </div>

              <div className="products-grid">
                {loading
                    ? Array.from({length: 9}).map((_, i) => <Skeleton key={i} height={300}/>)
                    : products.map(product => <ProductCard key={product.id} product={product}/>)}
              </div>


              {loadingMore && (
                  <div className="text-center mt-4">
                    <div className="spinner-border text-primary" role="status"/>
                  </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
  );
};

export default ProductList;
