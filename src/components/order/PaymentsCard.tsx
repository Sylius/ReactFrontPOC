import React from "react";
import {Payment} from "../../types/Order";
import {useQuery} from "@tanstack/react-query";
import {formatPrice} from "../../utils/price";

interface PaymentsCardProps {
    payment: Payment;
    total: number;
}

const PaymentsCard: React.FC<PaymentsCardProps> = ({ payment, total }) => {

    const fetchPaymentMethodFromAPI = async (): Promise<any> => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${payment.method}`);
        if (!response.ok) {
            throw new Error('Problem z pobieraniem metody płatności');
        }

        const data = await response.json();

        return data['hydra:member'] || data;
    };

    const { data: paymentMethod } = useQuery({ queryKey: ["payment-method"], queryFn: fetchPaymentMethodFromAPI });

    return (
        <div className="card border-0 bg-body-tertiary mb-3">
            <div className="card-header d-flex align-items-center">
                <div className="me-auto">
                    Payments
                </div>
            </div>

            <div className="card-body d-flex flex-column gap-2">
                <div className="d-flex gap-4">
                    <div className="me-auto">
                        { paymentMethod?.name }
                    </div>

                    <div className="fw-medium">
                        ${ formatPrice(total) }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsCard;
