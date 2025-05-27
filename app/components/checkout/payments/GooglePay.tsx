import React from "react";
import {formatPrice} from "../../../utils/price";
import {useOrder} from "../../../context/OrderContext";

interface GooglePayProps {
    submitFunction: (e?: React.FormEvent) => Promise<void>;
}

const GooglePay:React.FC<GooglePayProps> = ({submitFunction}) => {
    const { order } = useOrder();
    const pay = async () => {
        const supportedInstruments = [
            {
                supportedMethods: "https://google.com/pay",
                data: {
                    environment: "TEST",
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                        {
                            type: "CARD",
                            parameters: {
                                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                                allowedCardNetworks: ["VISA", "MASTERCARD"],
                            },
                            tokenizationSpecification: {
                                type: "PAYMENT_GATEWAY",
                                parameters: {
                                    gateway: "example",
                                    gatewayMerchantId: "exampleMerchantId",
                                },
                            },
                        },
                    ],
                    merchantInfo: {
                        merchantId: "01234567890123456789",
                        merchantName: "Sylius React POC",
                    },
                    transactionInfo: {
                        totalPriceStatus: "FINAL",
                        totalPrice: formatPrice(order.total),
                        currencyCode: "USD",
                        countryCode: "US",
                    },
                },
            },
        ];

        const paymentDetails = {
            id: 'order-123',
            displayItems: [
                {
                    label: 'PWA Demo Payment',
                    amount: {currency: 'USD', value: formatPrice(order.total)}
                }
            ],
            total: {
                label: 'Total',
                amount: {currency: 'USD', value: '0.01'}
            }
        };

        const request = new PaymentRequest(supportedInstruments, paymentDetails);
        const response = await request.show();

        await response.complete("success");
        await submitFunction();
    }

    return (
        <div className="card bg-body-tertiary border-0 mb-3" onClick={pay}>
            <label className="card-body cursor-pointer">
                <div className="d-flex align-items-center">
                    <div>
                        <img
                            className={'col-12'}
                            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                            alt="Google"
                            style={{height: '60px', width: '60px'}}
                        />
                    </div>

                    <div>
                        <div>
                            <div>
                                <div
                                    className="form-check-label required">
                                    Google Pay
                                </div>
                            </div>
                        </div>

                        <div>
                            <small className="text-black-50">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                            </small>
                        </div>
                    </div>
                </div>
            </label>
        </div>
    )
}

export default GooglePay;
