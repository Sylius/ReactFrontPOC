import React from "react";
import { Address } from '../types/Address';

interface AddressProps {
    sectionName: string;
    address: Address;
}

const BillingCard: React.FC<AddressProps> = ({ sectionName, address }) => {
    const fullName = `${address.firstName ?? ''} ${address.lastName ?? ''}`.trim();

    return (
        <div className="card border-0 bg-body-tertiary">
            <div className="card-header">{sectionName}</div>
            <div className="card-body">
                <address className="d-flex flex-column">
                    {address.company && <strong>{address.company}</strong>}
                    <strong>{fullName}</strong>
                    <span>{address.phoneNumber}</span>
                    <span>{address.street}</span>
                    <span>{address.city}, {address.postcode}</span>
                    <span>{address.countryCode}</span>
                </address>
            </div>
        </div>
    );
};

export default BillingCard;
