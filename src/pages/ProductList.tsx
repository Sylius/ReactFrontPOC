import { type FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Skeleton from 'react-loading-skeleton';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import Layout from '@/layouts/Default';
import type { Product } from '@/types/Product';
import { apiFetch } from '@/utils/apiFetch';

interface TaxonDetails {
  name: string;
  description: string;
  code: string;
  parent?: {
    name: string;
    code: string;
  };
}

const ProductList: FC = () => {
  const { parentCode, childCode } = useParams<{
    parentCode: string;
    childCode: string;
  }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [taxonDetails, setTaxonDetails] = useState<TaxonDetails | null>(null);

  const fetchProducts = async (page: number, code: string): Promise<Product[]> => {
    const url = `/api/v2/shop/products?itemsPerPage=9&page=${page}&productTaxons.taxon.code=${code}`;
    const response = await apiFetch(url);
    const data = await response.json();
    const totalItems = data['hydra:totalItems'] || 0;
    setTotalPages(Math.max(1, Math.ceil(totalItems / 9)));
    return data['hydra:member'] || [];
  };

  const fetchTaxonDetails = async (code: string): Promise<TaxonDetails | null> => {
    try {
      const res = await apiFetch(`/api/v2/shop/taxons/${code}`);
      if (!res.ok) throw new Error('Nie udało się pobrać szczegółów taxona');
      const data = await res.json();

      let parentData = null;
      if (data?.parent) {
        const parentRes = await apiFetch(data.parent);
        if (parentRes.ok) {
          const parentJson = await parentRes.json();
          parentData = {
            name: parentJson.name,
            code: parentJson.code,
          };
        }
      }

      return {
        name: data.name,
        description: data.description,
        code: data.code,
        parent: parentData || undefined,
      };
    } catch (err) {
      console.error('Error loading taxon data:', err);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!childCode) {
        setError('No taxon code in the URL');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [productsData, taxonData] = await Promise.all([
          fetchProducts(currentPage, childCode),
          fetchTaxonDetails(childCode),
        ]);

        setProducts(productsData);
        setTaxonDetails(taxonData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, childCode]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (error) return <div className='text-center text-danger'>Błąd: {error}</div>;

  return (
    <Layout>
      <div className='container mt-4 mb-5'>
        <Breadcrumbs
          paths={[
            { label: 'Home', url: '/' },
            ...(taxonDetails?.parent
              ? [
                  {
                    label: taxonDetails.parent.name,
                    url: `/${taxonDetails.parent.code}`,
                  },
                ]
              : []),
            {
              label: taxonDetails?.name || childCode || '',
              url: `/${parentCode}/${childCode}`,
            },
          ]}
        />
        <div className='row mt-5'>
          <div className='col-12 col-lg-3'>{/* Filters or categories can go here */}</div>
          <div className='col-12 col-lg-9'>
            <div className='mb-4'>
              <h1 className='mb-3'>{loading ? <Skeleton /> : taxonDetails?.name || childCode}</h1>
              <div>
                {loading ? (
                  <Skeleton count={2} />
                ) : (
                  taxonDetails?.description || 'No description available for this category.'
                )}
              </div>
            </div>
            <div className='products-grid'>
              {products.length > 0
                ? products.map((product) => <ProductCard key={product.id} product={product} />)
                : !loading && (
                    <div className='text-center'>No products available in this category.</div>
                  )}
            </div>
            <div className='pagination justify-content-center mt-4'>
              <button
                type='button'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='page-item disabled:bg-gray-200'
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  type='button'
                  key={`page-${index + 1}`}
                  onClick={() => handlePageChange(index + 1)}
                  className={`page-item ${currentPage === index + 1 ? 'current' : ''}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                type='button'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='page-item rounded disabled:bg-gray-200'
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductList;
