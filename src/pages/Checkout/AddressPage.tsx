import React, { useEffect, useRef, useState } from 'react';
import CheckoutLayout from '../../layouts/Checkout';
import { AddressInterface } from '../../types/Order';
import { useNavigate, Link } from 'react-router-dom';
import Steps from '../../components/checkout/Steps';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useCustomer } from '../../context/CustomerContext';
import { useOrder } from '../../context/OrderContext';

interface Country {
    code: string;
    name: string;
}

const emptyAddress: AddressInterface = {
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    countryCode: '',
    city: '',
    postcode: '',
    phoneNumber: '',
};

const AddressPage: React.FC = () => {
    const { customer } = useCustomer();
    const { order, fetchOrder } = useOrder();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [billingAddress, setBillingAddress] = useState<AddressInterface>(emptyAddress);
    const [shippingAddress, setShippingAddress] = useState<AddressInterface>(emptyAddress);
    const [useDifferentShipping, setUseDifferentShipping] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addresses, setAddresses] = useState<AddressInterface[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);

    const isInitialized = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('jwtToken');

            try {
                const [addressesRes, countriesRes] = await Promise.all([
                    token
                        ? fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/addresses`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                        : Promise.resolve({ json: () => ({ 'hydra:member': [] }) }),
                    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/countries`),
                ]);

                const addressData = await addressesRes.json();
                const countryData = await countriesRes.json();

                const addressItems = addressData['hydra:member'] as AddressInterface[];
                const countryItems = countryData['hydra:member'] as Country[];

                setAddresses(addressItems);
                setCountries(countryItems);

                if (!isInitialized.current) {
                    if (order?.billingAddress) {
                        setBillingAddress(order.billingAddress);
                    } else if (token && customer) {
                        const defaultAddressId =
                            typeof customer.defaultAddress === 'string'
                                ? customer.defaultAddress.split('/').pop()
                                : customer.defaultAddress?.['@id']?.split('/').pop();

                        const defaultAddress = addressItems.find(addr => String(addr.id) === defaultAddressId);
                        if (defaultAddress) {
                            setBillingAddress({ ...defaultAddress });
                        }
                    }

                    if (order?.shippingAddress) {
                        setUseDifferentShipping(true);
                        setShippingAddress(order.shippingAddress);
                    }

                    isInitialized.current = true;
                }
            } catch (error) {
                console.error('Error loading addresses or countries', error);
            }
        };

        fetchData();
    }, [customer, order]);

    const handleChange =
        (setter: React.Dispatch<React.SetStateAction<AddressInterface>>) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                const { name, value } = e.target;
                setter(prev => ({ ...prev, [name]: value }));
            };

    const handleAddressSelect =
        (setter: React.Dispatch<React.SetStateAction<AddressInterface>>) =>
            (e: React.ChangeEvent<HTMLSelectElement>) => {
                const selectedId = e.target.value;
                const selected = addresses.find(addr => String(addr.id) === selectedId);
                if (selected) {
                    setter({ ...selected });
                }
            };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_REACT_APP_API_URL}/api/v2/shop/orders/${localStorage.getItem('orderToken')}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: customer?.email ?? email,
                        billingAddress,
                        shippingAddress: useDifferentShipping ? shippingAddress : billingAddress,
                        couponCode: null,
                    }),
                }
            );

            if (!response.ok) throw new Error('Failed to submit order');

            await fetchOrder();
            navigate('/checkout/select-shipping');
        } catch (err) {
            console.error('Order submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderAddressForm = (
        address: AddressInterface,
        setAddress: React.Dispatch<React.SetStateAction<AddressInterface>>
    ) => (
        <>
            {addresses.length > 0 && (
                <div className="mb-3">
                    <label className="form-label">Select address from my book</label>
                    <select className="form-select" onChange={handleAddressSelect(setAddress)}>
                        <option value="">Select address from my book</option>
                        {addresses.map(addr => {
                            const countryName = countries.find(c => c.code === addr.countryCode)?.name || addr.countryCode;
                            return (
                                <option key={addr.id} value={addr.id}>
                                    {addr.firstName} {addr.lastName}, {addr.street}, {addr.city} {addr.postcode}, {countryName}
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label required">First name</label>
                    <input name="firstName" className="form-control" required value={address.firstName} onChange={handleChange(setAddress)} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label required">Last name</label>
                    <input name="lastName" className="form-control" required value={address.lastName} onChange={handleChange(setAddress)} />
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Company</label>
                <input name="company" className="form-control" value={address.company} onChange={handleChange(setAddress)} />
            </div>

            <div className="mb-3">
                <label className="form-label required">Street address</label>
                <input name="street" className="form-control" required value={address.street} onChange={handleChange(setAddress)} />
            </div>

            <div className="mb-3">
                <label className="form-label required">Country</label>
                <select name="countryCode" className="form-select" required value={address.countryCode} onChange={handleChange(setAddress)}>
                    <option value="">Select</option>
                    {countries.map(country => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label required">City</label>
                <input name="city" className="form-control" required value={address.city} onChange={handleChange(setAddress)} />
            </div>

            <div className="mb-3">
                <label className="form-label required">Postcode</label>
                <input name="postcode" className="form-control" required value={address.postcode} onChange={handleChange(setAddress)} />
            </div>

            <div className="mb-4">
                <label className="form-label">Phone number</label>
                <input name="phoneNumber" className="form-control" value={address.phoneNumber} onChange={handleChange(setAddress)} />
            </div>
        </>
    );

    return (
        <CheckoutLayout>
            <div className="col pt-4 pb-5">
                <Steps activeStep="address" />
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 h2">Address</div>

                    {!customer && (
                        <div className="mb-4">
                            <label className="form-label required">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <div className="h4 mb-4">Billing address</div>
                        {renderAddressForm(billingAddress, setBillingAddress)}
                    </div>

                    <div className="form-check form-switch mb-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={useDifferentShipping}
                            onChange={() =>
                                setUseDifferentShipping(prev => {
                                    const next = !prev;
                                    if (next && !shippingAddress.firstName) {
                                        setShippingAddress({ ...billingAddress });
                                    }
                                    return next;
                                })
                            }
                            id="differentShipping"
                        />
                        <label className="form-check-label" htmlFor="differentShipping">
                            Use different address for shipping?
                        </label>
                    </div>

                    {useDifferentShipping && (
                        <div className="mb-4">
                            <div className="h4 mb-4">Shipping address</div>
                            {renderAddressForm(shippingAddress, setShippingAddress)}
                        </div>
                    )}

                    <div className="d-flex justify-content-between flex-column flex-sm-row gap-2">
                        <Link className="btn btn-light btn-icon" to="/">
                            <IconChevronLeft stroke={2} />
                            Back to store
                        </Link>
                        <button type="submit" className="btn btn-primary btn-icon" disabled={isSubmitting}>
                            Next
                            <IconChevronRight stroke={2} />
                        </button>
                    </div>
                </form>
            </div>
        </CheckoutLayout>
    );
};

export default AddressPage;
