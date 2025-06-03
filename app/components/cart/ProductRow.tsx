import React, { useState } from "react";
import type { OrderItem } from "~/types/Order";
import { formatPrice } from "~/utils/price";
import { useFetcher, Link } from "@remix-run/react";
import { IconX } from "@tabler/icons-react";

interface Props {
    item: OrderItem;
    fetcher: ReturnType<typeof useFetcher>;
}

export default function ProductRow({ item, fetcher }: Props) {
    const [qty, setQty] = useState(item.quantity ?? 1);
    const variant = typeof item.variant === "object" ? item.variant : null;
    const product = variant?.product;
    const image = product?.images?.[0]?.path ?? "";
    const productUrl = product?.code ? `/product/${product.code}` : "#";

    return (
        <tr>
            <td>
                <button
                    className="btn btn-sm btn-transparent px-2"
                    type="button"
                    onClick={() =>
                        fetcher.submit(
                            new URLSearchParams({ id: String(item.id), _intent: "remove" }),
                            { method: "post" }
                        )
                    }
                >
                    <IconX stroke={2} />
                </button>
            </td>

            <td>
                <div className="d-flex align-items-center gap-3 w-100">
                    {image && (
                        <div style={{ width: "8rem" }}>
                            <img src={image} alt={variant?.code} className="img-fluid rounded" />
                        </div>
                    )}
                    <div className="w-100">
                        <div className="link-reset text-break">
                            <Link to={productUrl} className="text-decoration-none">
                                {item.productName}
                            </Link>
                        </div>
                        {variant?.code && (
                            <div className="text-body-tertiary small">{variant.code}</div>
                        )}
                        {variant?.optionValues?.map((o, i) => (
                            <div key={i} className="text-body-tertiary small">
                                {o.option?.name ?? o.option?.code}: {o.value}
                            </div>
                        ))}
                    </div>
                </div>
            </td>

            <td className="text-black-50 text-end" style={{ width: "90px" }}>
                ${formatPrice(item.unitPrice)}
            </td>

            <td className="text-end" style={{ width: "110px" }}>
                <input
                    type="number"
                    className="form-control text-end"
                    min={1}
                    value={qty}
                    onChange={(e) => {
                        setQty(Number(e.target.value));
                        fetcher.submit(
                            new URLSearchParams({
                                id: String(item.id),
                                quantity: e.target.value,
                                _intent: "update",
                            }),
                            { method: "post" }
                        );
                    }}
                />
            </td>

            <td className="text-end" style={{ width: "90px" }}>
                ${formatPrice(item.subtotal)}
            </td>
        </tr>
    );
}
