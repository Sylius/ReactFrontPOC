import React from "react";
import Skeleton from "react-loading-skeleton";

interface AddressFormProps {
    formData: {
        firstName: string;
        lastName: string;
        company: string;
        street: string;
        countryCode: string;
        provinceName: string;
        city: string;
        postcode: string;
        phoneNumber: string;
    };
    countries: { code: string; name: string }[];
    loadingCountries: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ formData, countries, loadingCountries, onChange }) => (
    <div className="row">
        <div className="col-12 col-md-6 mb-3">
            <label className="form-label">First name *</label>
            <input
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                required
            />
        </div>
        <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Last name *</label>
            <input
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={onChange}
                required
            />
        </div>
        <div className="col-12 mb-3">
            <label className="form-label">Company</label>
            <input className="form-control" name="company" value={formData.company} onChange={onChange} />
        </div>
        <div className="col-12 mb-3">
            <label className="form-label">Street address *</label>
            <input
                className="form-control"
                name="street"
                value={formData.street}
                onChange={onChange}
                required
            />
        </div>
        <div className="col-12 mb-3">
            <label className="form-label">Country *</label>
            {loadingCountries ? (
                <Skeleton height={36} />
            ) : (
                <select
                    className="form-select"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={onChange}
                    required
                >
                    <option value="" disabled>Select</option>
                    {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
        {formData.countryCode && (
            <div className="col-12 mb-3">
                <label className="form-label">Province</label>
                <input
                    className="form-control"
                    name="provinceName"
                    value={formData.provinceName}
                    onChange={onChange}
                />
            </div>
        )}
        <div className="col-12 col-md-6 mb-3">
            <label className="form-label">City *</label>
            <input
                className="form-control"
                name="city"
                value={formData.city}
                onChange={onChange}
                required
            />
        </div>
        <div className="col-12 col-md-6 mb-3">
            <label className="form-label">Postcode *</label>
            <input
                className="form-control"
                name="postcode"
                value={formData.postcode}
                onChange={onChange}
                required
            />
        </div>
        <div className="col-12 mb-3">
            <label className="form-label">Phone number</label>
            <input
                className="form-control"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChange}
            />
        </div>
    </div>
);

export default AddressForm;
