import React, {useState} from 'react';
import { OrderItem } from '../../types/Order';
import { formatPrice } from "../../utils/price";

interface ProductRowProps {
    orderItem: OrderItem;
    onRemove: any;
    onUpdate: any;
}

const ProductRow: React.FC<ProductRowProps> = ({orderItem, onRemove, onUpdate}) => {
    // const imageUrl = product.images && product.images[0].path
    //     ? `${product.images[0].path}`
    //     : 'https://via.placeholder.com/300';

    const [localQuantity, setLocalQuantity] = useState<string>(orderItem.quantity?.toString() || "1");

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

                            {/*<img className="img-fluid w-100 h-100 object-fit-cover"*/}
                            {/*     src={ imageUrl }*/}
                            {/*     alt="Product Celestial Harmony T-Shirt Image"/>*/}

                        </div>
                    </div>
                    <div>
                        <div className="h6">
                            <a className="link-reset text-break" href="/en_US/products/celestial-harmony-t-shirt">
                                { orderItem.productName }
                            </a>
                        </div>

                        <small className="text-body-tertiary">Celestial_Harmony_T_Shirt-variant-0</small>

                        <div>
                            <small className="text-body-tertiary">
                                T-shirt size: <span>S</span>
                            </small>
                        </div>
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
