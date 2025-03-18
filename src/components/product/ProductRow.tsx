import React, {useState} from 'react';
import { OrderItem } from '../../types/Order';
import { formatPrice } from "../../utils/price";
import {useQuery} from "@tanstack/react-query";

interface ProductRowProps {
    orderItem: OrderItem;
    onRemove: any;
    onUpdate: any;
}

const ProductRow: React.FC<ProductRowProps> = ({orderItem, onRemove, onUpdate}) => {
    const [localQuantity, setLocalQuantity] = useState<string>(orderItem.quantity?.toString() || "1");

    const fetchVariant = async (): Promise<any> => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${orderItem.variant}`);
        if (!response.ok) {
            throw new Error('Problem z pobieraniem wariantu');
        }

        const data = await response.json();

        return data['hydra:member'] || data;
    };

    const {data: variant} = useQuery<any, Error>({
        queryKey: ['variant', orderItem.id],
        queryFn: fetchVariant,
    });

    const fetchProduct = async (): Promise<any> => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${variant.product}`);
        if (!response.ok) {
            throw new Error('Problem z pobieraniem wariantu');
        }

        const data = await response.json();

        return data['hydra:member'] || data;
    };

    const {data: product} = useQuery<any, Error>({
        queryKey: [orderItem.id],
        queryFn: fetchProduct,
    });

    return (
        <tr>
            <td>
                <button
                    className="btn btn-sm btn-transparent px-2"
                    type="button"
                    onClick={() => onRemove(orderItem.id)}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler" width="16" height="16"
                         viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
                         strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M18 6l-12 12"></path>
                        <path d="M6 6l12 12"></path>
                    </svg>
                </button>
            </td>
            <td>

                <div className="d-flex align-items-center gap-4">
                    <div style={{ width: '6rem' }}>
                        <div className="overflow-auto bg-light rounded-3" style={{ aspectRatio: '3/4' }}>

                            {product?.images[0]?.path &&
                                <img className="img-fluid w-100 h-100 object-fit-cover"
                                     src={product?.images[0]?.path}
                                     alt={ variant.code }
                                />
                            }

                        </div>
                    </div>
                    <div>
                        <div className="h6">
                            <a className="link-reset text-break" href="/en_US/products/celestial-harmony-t-shirt">
                                { orderItem?.productName }
                            </a>
                        </div>

                        <small className="text-body-tertiary">{ variant?.code }</small>
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
                        id="sylius_shop_cart_items_0_quantity"
                        name="sylius_shop_cart[items][0][quantity]"
                        required={true}
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
                /></div>
            </td>

            <td className="text-end">
                <span>${formatPrice(orderItem.subtotal)}</span>
            </td>
        </tr>
    );
}

export default ProductRow;
