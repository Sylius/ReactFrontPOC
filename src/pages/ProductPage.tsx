import { type FC, useEffect, useState } from 'react';
import Layout from '@/layouts/Default';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import BootstrapAccordion from '@/components/Accordion';
import { formatPrice } from '@/utils/price';
import { useOrder } from '@/context/OrderContext';
import Skeleton from 'react-loading-skeleton';
import type {
  Product,
  ProductVariantDetails,
  ProductOption,
  ProductOptionValue,
} from '@/types/Product';
import { apiFetch } from '@/utils/apiFetch';

const ProductPage: FC = () => {
  const { fetchOrder } = useOrder();
  const { code } = useParams<{ code: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [variant, setVariant] = useState<ProductVariantDetails | null>(null);
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const fetchOption = async (url: string): Promise<ProductOption> => {
    const res = await apiFetch(url);
    const data = await res.json();

    const values: ProductOptionValue[] = await Promise.all(
      data.values.map(async (valueUrl: string) => {
        const res = await apiFetch(valueUrl);
        return await res.json();
      }),
    );

    return {
      code: data.code,
      name: data.name,
      values,
    };
  };

  const fetchVariantByOptions = async (productCode: string, selected: Record<string, string>) => {
    const baseUrl = '/api/v2/shop/product-variants';
    const productParam = `product=/api/v2/shop/products/${productCode}`;
    const optionParams = Object.entries(selected)
      .map(
        ([optionCode, valueCode]) =>
          `optionValues[]=/api/v2/shop/product-options/${optionCode}/values/${valueCode}`,
      )
      .join('&');

    const fullUrl = `${baseUrl}?${productParam}&${optionParams}`;
    const res = await apiFetch(fullUrl);
    const data = await res.json();
    setVariant(data['hydra:member']?.[0] || null);
  };

  const fetchProduct = async () => {
    try {
      const res = await apiFetch(`/api/v2/shop/products/${code}`);
      const data = await res.json();

      setProduct(data);

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
        const res = await apiFetch(data.defaultVariant);
        const variantData = await res.json();
        setVariant(variantData);
      }
    } catch (error) {
      setError(`Error while loading product data: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (optionCode: string, valueCode: string) => {
    const updated = { ...selectedValues, [optionCode]: valueCode };
    setSelectedValues(updated);

    if (product) {
      fetchVariantByOptions(product.code, updated);
    }
  };

  const handleAddToCart = async () => {
    if (!variant) return;
    setIsAddToCartLoading(true);
    try {
      const response = await apiFetch(
        `/api/v2/shop/orders/${localStorage.getItem('orderToken')}/items`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productVariant: variant.code,
            quantity,
          }),
        },
      );
      if (!response.ok) throw new Error('Failed to add to cart');
      fetchOrder();
      setShowConfirmation(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAddToCartLoading(false);
    }
  };

  useEffect(() => {
    if (code) fetchProduct();
  }, [code]);

  const accordionItems = product
    ? [
        { title: 'Product Description', content: product.description },
        { title: 'Attributes', content: 'Product attributes will be here...' },
        { title: 'Reviews', content: 'Product reviews will be here...' },
      ]
    : [];

  if (error) return <div className='text-danger text-center'>{error}</div>;

  return (
    <Layout>
      <div className='container mt-4 mb-5'>
        <Breadcrumbs
          paths={[
            { label: 'Home', url: '/' },
            { label: product?.name || '...', url: `/product/${code}` },
          ]}
        />

        <div className='row g-3 g-lg-5 mb-6'>
          <div className='col-12 col-lg-7 col-xl-8'>
            <div className='row spotlight-group mb-5'>
              <div className='col pe-lg-5 pe-xxl-5'>
                <div
                  className='overflow-hidden bg-light rounded-3'
                  style={{ aspectRatio: '3 / 4', height: 'auto' }}
                >
                  {loading ? (
                    <Skeleton style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <img
                      src={product?.images[0]?.path}
                      alt={product?.name}
                      className='img-fluid w-100 h-100 object-fit-cover'
                    />
                  )}
                </div>
              </div>
            </div>
            {!loading && <BootstrapAccordion items={accordionItems} />}
          </div>

          <div className='col-12 col-lg-5 col-xl-4 order-lg-1'>
            <div className='sticky-top pt-2'>
              <div className='mb-4'>
                <h1 className='h2 text-break'>{product?.name}</h1>
              </div>

              <div className='fs-3 mb-3'>
                {loading ? (
                  <Skeleton width={100} />
                ) : variant?.price ? (
                  `$${formatPrice(variant.price)}`
                ) : (
                  'No price available'
                )}
              </div>

              {options.map((option) => (
                <div className='mb-3' key={option.code}>
                  <label className='form-label' htmlFor={`option-${option.code}`}>
                    {option.name}
                  </label>
                  <select
                    id={`option-${option.code}`}
                    className='form-select'
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

              <div className='position-relative my-4'>
                <form>
                  <div className='mb-4'>
                    <label className='form-label' htmlFor='quantity'>
                      Quantity
                    </label>
                    <input
                      id='quantity'
                      type='number'
                      className='form-control'
                      value={quantity}
                      min='1'
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className='mb-3'>
                    <button
                      type='button'
                      className='btn btn-success px-4 py-2'
                      onClick={handleAddToCart}
                      disabled={isAddToCartLoading || loading}
                    >
                      {isAddToCartLoading ? 'Adding...' : 'Add to cart'}
                    </button>
                  </div>
                </form>
              </div>

              <div className='mb-3'>
                {product?.shortDescription || 'No short description available'}
              </div>

              <small className='text-body-tertiary'>{product?.name.replace(/\s+/g, '_')}</small>

              {showConfirmation && (
                <div className='alert alert-success alert-dismissible fade show mt-3' role='alert'>
                  Product has been added to the cart!
                  <button
                    type='button'
                    className='btn-close'
                    aria-label='Close'
                    onClick={() => setShowConfirmation(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
