import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Default from "../../layouts/Default";
import AccountLayout from "../../layouts/Account";
import Skeleton from "react-loading-skeleton";
import { useFlashMessages } from "../../context/FlashMessagesContext";

interface Country {
    code: string;
    name: string;
}

const AddAddressPage: React.FC = () => {
    const navigate = useNavigate();
    const { addMessage } = useFlashMessages();

    const [countries, setCountries] = useState<Country[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        company: "",
        street: "",
        countryCode: "",
        provinceName: "",
        city: "",
        postcode: "",
        phoneNumber: "",
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/countries`);
                const data = await res.json();
                setCountries(data["hydra:member"] || []);
            } catch (error) {
                console.error("Error fetching countries", error);
            } finally {
                setLoadingCountries(false);
            }
        };

        fetchCountries();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Missing token");

            const res = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/addresses`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to add address");

            addMessage("success", "Address added successfully");
            navigate("/account/address-book");
        } catch (error) {
            console.error("Error submitting address", error);
            addMessage("error", "Failed to add address");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Default>
            <AccountLayout
                breadcrumbs={[
                    { label: "Home", url: "/" },
                    { label: "My account", url: "/account/dashboard" },
                    { label: "Address book", url: "/account/address-book" },
                    { label: "Create", url: "/account/address-book/create" },
                ]}
            >
                <div className="col-12 col-md-9">
                    <div className="mb-4">
                        <h1>Address book</h1>
                        <p>Add address</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label">First name *</label>
                                    <input
                                        className="form-control"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label">Last name *</label>
                                    <input
                                        className="form-control"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Company</label>
                                    <input
                                        className="form-control"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Street address *</label>
                                    <input
                                        className="form-control"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Country *</label>
                                    {loadingCountries ? (
                                        <Skeleton height={36}/>
                                    ) : (
                                        <select
                                            className="form-select"
                                            name="countryCode"
                                            value={formData.countryCode}
                                            onChange={handleChange}
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
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label">City *</label>
                                    <input
                                        className="form-control"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label">Postcode *</label>
                                    <input
                                        className="form-control"
                                        name="postcode"
                                        value={formData.postcode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Phone number</label>
                                    <input
                                        className="form-control"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? "Adding..." : "Add"}
                            </button>
                            <button type="button" className="btn btn-outline-gray"
                                    onClick={() => navigate("/account/address-book")}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </AccountLayout>
        </Default>
    );
};

export default AddAddressPage;
