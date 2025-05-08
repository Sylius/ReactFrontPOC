import React from 'react';
import { Payment } from '../../types/Order';
import { formatPrice } from '../../utils/price';

interface PaymentsCardProps {
    payment: Payment;
    total: number;
    paymentState?: string;
}

const PaymentsCard: React.FC<PaymentsCardProps> = ({ payment, total, paymentState }) => {
    return (
        <div className="card border-0 bg-body-tertiary mb-3">
            <div className="card-header d-flex align-items-center">
                <div className="me-auto">Payments</div>
                <div>{paymentState ?? ''}</div>
            </div>

            <div className="card-body d-flex flex-column gap-2">
                <div className="d-flex gap-4">
                    <div className="me-auto">
                        {typeof payment.method === 'object' && payment.method && 'name' in payment.method
                            ? payment.method.name
                            : ''}
                    </div>
                    <div className="fw-medium">${formatPrice(total)}</div>
                    <div>{payment.state ?? ''}</div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsCard;
