import React from "react";
import {Shipment} from "../../types/Order";
import {useQuery} from "@tanstack/react-query";

interface ShipmentsCardProps {
    shipment: Shipment;
}

const ShipmentsCard: React.FC<ShipmentsCardProps> = ({ shipment }) => {

    const fetchShippingMethodFromAPI = async (): Promise<any> => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${shipment.method}`);
        if (!response.ok) {
            throw new Error('Problem z pobieraniem metody płatności');
        }

        const data = await response.json();

        return data['hydra:member'] || data;
    };

    const { data: shippingMethod } = useQuery({ queryKey: ["shipping-method"], queryFn: fetchShippingMethodFromAPI });

    return (
        <div className="card border-0 bg-body-tertiary mb-3">
            <div className="card-header d-flex align-items-center">
                <div className="me-auto">
                    Shipments
                </div>
            </div>

            <div className="card-body d-flex flex-column gap-2">
                <div className="d-flex gap-4">

                    <div className="me-auto">
                        { shippingMethod?.name }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentsCard;
