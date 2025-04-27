import { useEffect, useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '@/types/Product';
import { formatPrice } from '@/utils/price';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { apiFetch } from '@/utils/apiFetch';

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [variant, setVariant] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        if (!product.variants.length) return;
        const response = await apiFetch(product.variants[0]);
        const data = await response.json();
        setVariant(data);
      } catch (error) {
        console.error('Błąd ładowania wariantu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariant();
  }, [product]);

  return (
    <div>
      <Link to={`/product/${product.code}`} className='link-reset'>
        <div className='mb-4'>
          <div className='bg-light rounded-3' style={{ aspectRatio: '3 / 4', overflow: 'hidden' }}>
            {loading ? (
              <Skeleton style={{ width: '100%', height: '100%', display: 'block' }} />
            ) : (
              <img
                src={product.images[0]?.path}
                alt={product.name}
                className='img-fluid w-100 h-100 object-fit-cover'
              />
            )}
          </div>
        </div>
        <div className='h6 text-break'>{loading ? <Skeleton width={120} /> : product.name}</div>
      </Link>
      <div>
        {loading ? (
          <Skeleton width={80} height={20} />
        ) : variant?.price ? (
          <span>${formatPrice(variant.price)}</span>
        ) : (
          <span>Brak ceny</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
