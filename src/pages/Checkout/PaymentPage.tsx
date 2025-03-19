import React, {useEffect, useState} from "react";

import CheckoutLayout from '../../layouts/Checkout';
import {Link} from "react-router";
import {useOrder} from "../../context/OrderContext";
import {useQuery} from "@tanstack/react-query";
import { formatPrice } from "../../utils/price";
import {useNavigate} from "react-router-dom";

const PaymentPage: React.FC = () => {

    const { order } = useOrder();
    const navigate = useNavigate()

    const fetchPaymentMethodsFromAPI = async (): Promise<any> => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v2/shop/orders/${process.env.REACT_APP_ORDER_TOKEN}/payments/${order?.payments[0].id}/methods`);
        if (!response.ok) {
            throw new Error('Problem z pobieraniem metod dostawy');
        }

        const data = await response.json();

        console.log(data)

        return data['hydra:member'] || data;
    };

    const { data: paymentMethods } = useQuery({ queryKey: ["payment-methods"], queryFn: fetchPaymentMethodsFromAPI, enabled: order !== null });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [hasErrors, setHasErrors] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v2/shop/orders/${process.env.REACT_APP_ORDER_TOKEN}/payments/${order.payments[0].id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/merge-patch+json" },
                body: JSON.stringify({ paymentMethod })
            });

            if (!response.ok) {
                setHasErrors(true);
                throw new Error("Nie udało się wysłać metody dostawy");
            }

            navigate("/checkout/complete");
        } catch (error) {
            console.error("Error submitting order:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <CheckoutLayout>
            <div className="col-12 col-lg-7 pt-4 pb-5">
                <div className="pe-lg-6">


                    <div className="steps steps-select_payment mb-5">
                        <div className="steps-item steps-item-completed">
                            <a href="/en_US/checkout/address">
                                Address
                            </a>
                        </div>
                        <div className="steps-item steps-item-completed">
                            <a href="/en_US/checkout/select-shipping">
                                Shipping
                            </a>
                        </div>
                        <div className="steps-item steps-item-active">
                            <a href="/en_US/checkout/select-payment">
                                Payment
                            </a>
                        </div>
                        <div className="steps-item steps-item-disabled">
                            Complete
                        </div>
                    </div>


                    <div data-controller="live" data-live-name-value="sylius_shop:checkout:payment:form"
                         data-live-url-value="/en_US/_components/sylius_shop:checkout:payment:form"
                         id="live-1350467424-0"
                         data-live-props-value="{&quot;formName&quot;:&quot;sylius_shop_checkout_select_payment&quot;,&quot;sylius_shop_checkout_select_payment&quot;:{&quot;payments&quot;:[{&quot;method&quot;:&quot;PAYPAL&quot;}],&quot;_token&quot;:&quot;94004cb8ac3ba863cf595d182c94.2y-5_TCUgzXIHaEJekeoHH5ZBmWaFi5Sfn-_74xBpTI.vhz8tVam53uDV-RkSQr_akg4QDy3T0UXIRPT3eYMkXiuf5SIVMvHfLx61g&quot;},&quot;isValidated&quot;:false,&quot;validatedFields&quot;:[],&quot;template&quot;:&quot;@SyliusShop\/checkout\/select_payment\/content\/form.html.twig&quot;,&quot;resource&quot;:67322,&quot;hookableMetadata&quot;:{&quot;renderedBy&quot;:&quot;sylius_shop.checkout.select_payment.content&quot;,&quot;configuration&quot;:&quot;[]&quot;,&quot;prefixes&quot;:[&quot;sylius_shop.checkout.select_payment.content&quot;,&quot;sylius_shop.base.select_payment.content&quot;]},&quot;@attributes&quot;:{&quot;id&quot;:&quot;live-1350467424-0&quot;},&quot;@checksum&quot;:&quot;1Ah5w+xgxumTPXJpFwWJcFXGiO2a32FU0lqM2qF8zo4=&quot;}">
                        <form name="sylius_shop_checkout_select_payment" method="post"
                              action="/en_US/checkout/select-payment" onSubmit={ handleSubmit } noValidate={true}>

                            <input type="hidden" name="_method" value="PUT"/>

                            <h5 className="mb-4">
                                Payment #1
                            </h5>

                            <div className="mb-5">
                                { hasErrors &&
                                    <div className="invalid-feedback d-block">
                                        Please select payment method.
                                    </div>
                                }
                                { paymentMethods?.map((method: any) => (
                                    <div className="card bg-body-tertiary border-0 mb-3" key={ method.id }>
                                        <label className="card-body">
                                            <div>
                                                <div className="form-check">
                                                    <input
                                                        type="radio"
                                                        id="sylius_shop_checkout_select_payment_payments_0_method_1"
                                                        name="sylius_shop_checkout_select_payment[payments][0][method]"
                                                        required={true}
                                                        className="form-check-input"
                                                        onChange={() => setPaymentMethod(method.code)}
                                                        checked={paymentMethod === method.code}
                                                        value={method.code}
                                                    />
                                                    <label
                                                        className="form-check-label required"
                                                        htmlFor="sylius_shop_checkout_select_payment_payments_0_method_1">
                                                        { method.name }
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="ps-4">
                                                <small className="text-black-50">
                                                    { method.description }
                                                </small>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>


                            <div className="d-flex justify-content-between flex-column flex-sm-row gap-2">
                                <Link className="btn btn-light btn-icon" to="/checkout/select-shipping">
                                    <svg viewBox="0 0 24 24" className="icon icon-sm flex-shrink-0" aria-hidden="true">
                                        <path fill="none" stroke="currentColor" strokeLinecap="round"
                                              strokeLinejoin="round" strokeWidth="2" d="m15 6l-6 6l6 6"></path>
                                    </svg>
                                    Change shipping method
                                </Link>

                                <button type="submit" className="btn btn-primary btn-icon" disabled={ isSubmitting }>
                                    Next <svg viewBox="0 0 24 24" className="icon icon-sm" aria-hidden="true">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round"
                                          strokeLinejoin="round" strokeWidth="2" d="m9 6l6 6l-6 6"></path>
                                </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </CheckoutLayout>
    );
}

export default PaymentPage;
