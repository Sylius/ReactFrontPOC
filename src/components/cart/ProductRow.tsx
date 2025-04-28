import React, { useState } from 'react';
import { OrderItem } from '../../types/Order';
import { formatPrice } from '../../utils/price';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { IconX } from '@tabler/icons-react';

interface ProductRowProps {
  orderItem: OrderItem;
  onRemove: any;
  onUpdate: any;
}

const ProductRow: React.FC<ProductRowProps> = ({
  orderItem,
  onRemove,
  onUpdate,
}) => {
  const [localQuantity, setLocalQuantity] = useState<string>(
    orderItem.quantity?.toString() || '1'
  );

  const fetchVariant = async (): Promise<any> => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}${orderItem.variant}`
    );
    if (!response.ok) {
      throw new Error('Problem z pobieraniem wariantu');
    }

    return await response.json();
  };

  const { data: variant } = useQuery<any, Error>({
    queryKey: ['variant', orderItem.id],
    queryFn: fetchVariant,
  });

  const fetchProduct = async (): Promise<any> => {
    const response = await fetch(
      `${import.meta.env.VITE_REACT_APP_API_URL}${variant.product}`
    );
    if (!response.ok) {
      throw new Error('Problem z pobieraniem produktu');
    }

    return await response.json();
  };

  const { data: product } = useQuery<any, Error>({
    queryKey: ['product', orderItem.id],
    queryFn: fetchProduct,
    enabled: !!variant?.product,
  });

  return (
    <tr>
      <td>
        <button
          className="btn btn-sm btn-transparent px-2"
          type="button"
          onClick={() => onRemove(orderItem.id)}
        >
          <IconX stroke={2} />
        </button>
      </td>
      <td>
        <div className="d-flex align-items-center gap-4">
          <div style={{ width: '6rem' }}>
            <div
              className="overflow-auto bg-light rounded-3"
              style={{ aspectRatio: '3/4' }}
            >
              {product?.images?.[0]?.path && (
                <img
                  className="img-fluid w-100 h-100 object-fit-cover"
                  src={product.images[0].path}
                  alt={variant?.code}
                />
              )}
            </div>
          </div>
          <div>
            <div className="h6">
              {product?.code ? (
                <Link
                  className="link-reset text-break"
                  to={`/product/${product.code}`}
                >
                  {orderItem?.productName}
                </Link>
              ) : (
                orderItem?.productName
              )}
            </div>
            <small className="text-body-tertiary">{variant?.code}</small>
          </div>
        </div>
      </td>
      <td className="text-black-50 text-end">
        <span>${formatPrice(orderItem.unitPrice)}</span>
      </td>
      <td>
        <div className="mt-3 field mb-3 required">
          <input
            type="number"
            className="form-control"
            min={1}
            onChange={(e) => {
              const newQuantity = e.target.value;
              setLocalQuantity(newQuantity);
              const parsedQuantity = parseInt(newQuantity, 10);
              if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
                onUpdate(orderItem.id, parsedQuantity);
              }
            }}
            value={localQuantity}
          />
        </div>
      </td>
      <td className="text-end">
        <span>${formatPrice(orderItem.subtotal)}</span>
      </td>
    </tr>
  );
};

export default ProductRow;
