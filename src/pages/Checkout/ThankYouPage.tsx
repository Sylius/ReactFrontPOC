import React, {useEffect} from "react";
import Layout from "../../layouts/Default";
import {useOrder} from "../../context/OrderContext.tsx";


const ThankYouPage: React.FC = () => {
    const { fetchOrder } = useOrder();

    useEffect(() => {
        fetchOrder();
    }, []);

    return (
        <Layout>
            <div className="container text-center my-auto">
                <div className="row flex-column my-4">
                    <h1 className="h2">Thank you!</h1>
                    You have successfully placed an order.

                    <div className="d-flex flex-column flex-lg-row justify-content-center gap-2 mt-4">

                        <a className="btn btn-primary" id="payment-method-page">
                            Change payment method
                        </a>

                        <a className="btn btn-secondary" id="create-an-account">
                            Create an account
                        </a>
                    </div>
                </div>
            </div>
        </Layout>
    )
};

export default ThankYouPage;
