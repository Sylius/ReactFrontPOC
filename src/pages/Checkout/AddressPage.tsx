import { type FC, useState } from 'react';
import Steps from '@/components/checkout/Steps';
import CheckoutLayout from '@/layouts/Checkout';
import type { AddressInterface } from '@/types/Order';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch } from '@/utils/apiFetch';

const AddressPage: FC = () => {
  const [billingAddress, setBillingAddress] = useState<AddressInterface>({
    firstName: '',
    lastName: '',
    company: '',
    street: '',
    countryCode: '',
    city: '',
    postcode: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else {
      setBillingAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await apiFetch(`/api/v2/shop/orders/${localStorage.getItem('orderToken')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingAddress,
          email,
          shippingAddress: billingAddress,
          couponCode: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const formattedErrors: Record<string, string> = {};

        data.violations?.forEach((error: { propertyPath: string; message: string }) => {
          const fieldName = error.propertyPath.replace('billingAddress.', '');
          formattedErrors[fieldName] = error.message;
        });

        setErrors(formattedErrors || {});
        throw new Error('Failed to submit order');
      }

      navigate('/checkout/select-shipping');
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CheckoutLayout>
      <div className='col pt-4 pb-5'>
        <div>
          <Steps activeStep='address' />

          <div
            data-controller='live'
            data-live-name-value='sylius_shop:checkout:address:form'
            data-live-url-value='/en_US/_components/sylius_shop:checkout:address:form'
            data-live-listeners-value='[{&quot;action&quot;:&quot;addressFieldUpdated&quot;,&quot;event&quot;:&quot;sylius:shop:address-updated&quot;}]'
            id='live-1350467424-0'
            data-live-props-value='{&quot;emailExists&quot;:false,&quot;resource&quot;:66780,&quot;formName&quot;:&quot;sylius_shop_checkout_address&quot;,&quot;sylius_shop_checkout_address&quot;:{&quot;differentBillingAddress&quot;:null,&quot;differentShippingAddress&quot;:null,&quot;shippingAddress&quot;:{&quot;firstName&quot;:&quot;&quot;,&quot;lastName&quot;:&quot;&quot;,&quot;phoneNumber&quot;:&quot;&quot;,&quot;company&quot;:&quot;&quot;,&quot;countryCode&quot;:&quot;&quot;,&quot;street&quot;:&quot;&quot;,&quot;city&quot;:&quot;&quot;,&quot;postcode&quot;:&quot;&quot;,&quot;__dynamic_error&quot;:&quot;&quot;},&quot;billingAddress&quot;:{&quot;firstName&quot;:&quot;&quot;,&quot;lastName&quot;:&quot;&quot;,&quot;phoneNumber&quot;:&quot;&quot;,&quot;company&quot;:&quot;&quot;,&quot;countryCode&quot;:&quot;&quot;,&quot;street&quot;:&quot;&quot;,&quot;city&quot;:&quot;&quot;,&quot;postcode&quot;:&quot;&quot;,&quot;__dynamic_error&quot;:&quot;&quot;},&quot;customer&quot;:{&quot;email&quot;:&quot;&quot;},&quot;_token&quot;:&quot;5ffeca70aac9afcc7d21015eee1745df.P3reSeEhUg9ZiVTTtZFYYG2Cnsy0MFezzFYeXKGkve8.Si-cH5VJGW0I2ji63cACGiPOzr39Am-DvDVBb-yJ7KB1F5h5jUo_djbROw&quot;},&quot;isValidated&quot;:false,&quot;validatedFields&quot;:[],&quot;hookableMetadata&quot;:{&quot;renderedBy&quot;:&quot;sylius_shop.checkout.address.content&quot;,&quot;configuration&quot;:&quot;[]&quot;,&quot;prefixes&quot;:[&quot;sylius_shop.checkout.address.content&quot;,&quot;sylius_shop.base.address.content&quot;]},&quot;template&quot;:&quot;@SyliusShop\/checkout\/address\/content\/form.html.twig&quot;,&quot;@attributes&quot;:{&quot;id&quot;:&quot;live-1350467424-0&quot;},&quot;@checksum&quot;:&quot;sIieEmhrJal3lA+4nE2dLurJliM0dzr2S0KLNCKsmrg=&quot;}'
          >
            <form
              name='sylius_shop_checkout_address'
              method='post'
              action='/en_US/checkout/address'
              data-model='on(change)|*'
              noValidate={true}
              onSubmit={handleSubmit}
            >
              <input type='hidden' name='_method' value='PUT' />

              <div className='mb-4 h2'>Address</div>

              <div data-controller='api-login' data-api-login-url-value='/en_US/json-login-check'>
                <div className='d-none'>
                  <div className='alert alert-danger' data-api-login-target='errorPrototype' />
                </div>
                <div className=' field mb-3 required'>
                  <label
                    htmlFor='sylius_shop_checkout_address_customer_email'
                    className='form-label required'
                  >
                    Email
                  </label>
                  <input
                    type='email'
                    id='sylius_shop_checkout_address_customer_email'
                    name='email'
                    required={true}
                    data-api-login-target='email'
                    className='form-control'
                    value={email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='mb-4'>
                <div className='mb-4 '>
                  <div className='h4 mb-4'>Billing address</div>

                  <div className='row'>
                    <div className='col-12 col-md-6'>
                      <div className=' field mb-3 required'>
                        <label
                          htmlFor='sylius_shop_checkout_address_billingAddress_firstName'
                          className='form-label required'
                        >
                          First name
                        </label>
                        <input
                          type='text'
                          id='sylius_shop_checkout_address_billingAddress_firstName'
                          name='firstName'
                          required={true}
                          className='form-control'
                          value={billingAddress.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && (
                          <div className='invalid-feedback d-block'>{errors.firstName}</div>
                        )}
                      </div>
                    </div>

                    <div className='col-12 col-md-6'>
                      <div className=' field mb-3 required'>
                        <label
                          htmlFor='sylius_shop_checkout_address_billingAddress_lastName'
                          className='form-label required'
                        >
                          Last name
                        </label>
                        <input
                          type='text'
                          id='sylius_shop_checkout_address_billingAddress_lastName'
                          name='lastName'
                          required={true}
                          className='form-control'
                          value={billingAddress.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && (
                          <div className='invalid-feedback d-block'>{errors.lastName}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className=' field mb-3'>
                    <label
                      htmlFor='sylius_shop_checkout_address_billingAddress_company'
                      className='form-label'
                    >
                      Company
                    </label>
                    <input
                      type='text'
                      id='sylius_shop_checkout_address_billingAddress_company'
                      name='company'
                      className='form-control'
                      value={billingAddress.company}
                      onChange={handleChange}
                    />
                    {errors.company && (
                      <div className='invalid-feedback d-block'>{errors.company}</div>
                    )}
                  </div>

                  <div className=' field mb-3 required'>
                    <label
                      htmlFor='sylius_shop_checkout_address_billingAddress_street'
                      className='form-label required'
                    >
                      Street address
                    </label>
                    <input
                      id='sylius_shop_checkout_address_billingAddress_street'
                      type='text'
                      name='street'
                      required={true}
                      className='form-control'
                      value={billingAddress.street}
                      onChange={handleChange}
                    />
                    {errors.street && (
                      <div className='invalid-feedback d-block'>{errors.street}</div>
                    )}
                  </div>

                  <div className='mb-3'>
                    <div className=' field mb-3 required'>
                      <label
                        className='form-label required'
                        htmlFor='sylius_shop_checkout_address_billingAddress_countryCode'
                      >
                        Country
                      </label>
                      <select
                        id='sylius_shop_checkout_address_billingAddress_countryCode'
                        name='countryCode'
                        required={true}
                        className='form-select'
                        value={billingAddress.countryCode}
                        onChange={handleChange}
                      >
                        <option value=''>Select</option>
                        <option value='AU'>Australia</option>
                        <option value='CA'>Canada</option>
                        <option value='CN'>China</option>
                        <option value='FR'>France</option>
                        <option value='DE'>Germany</option>
                        <option value='MX'>Mexico</option>
                        <option value='NZ'>New Zealand</option>
                        <option value='PL'>Poland</option>
                        <option value='PT'>Portugal</option>
                        <option value='ES'>Spain</option>
                        <option value='GB'>United Kingdom</option>
                        <option value='US'>United States</option>
                      </select>
                      {errors.countryCode && (
                        <div className='invalid-feedback d-block'>{errors.countryCode}</div>
                      )}
                    </div>
                  </div>

                  <div className=' field mb-3 required'>
                    <label
                      htmlFor='sylius_shop_checkout_address_billingAddress_city'
                      className='form-label required'
                    >
                      City
                    </label>
                    <input
                      type='text'
                      id='sylius_shop_checkout_address_billingAddress_city'
                      name='city'
                      required={true}
                      className='form-control'
                      value={billingAddress.city}
                      onChange={handleChange}
                    />
                    {errors.city && <div className='invalid-feedback d-block'>{errors.city}</div>}
                  </div>

                  <div className=' field mb-3 required'>
                    <label
                      htmlFor='sylius_shop_checkout_address_billingAddress_postcode'
                      className='form-label required'
                    >
                      Postcode
                    </label>
                    <input
                      id='sylius_shop_checkout_address_billingAddress_postcode'
                      type='text'
                      name='postcode'
                      required={true}
                      className='form-control'
                      value={billingAddress.postcode}
                      onChange={handleChange}
                    />
                    {errors.postcode && (
                      <div className='invalid-feedback d-block'>{errors.postcode}</div>
                    )}
                  </div>

                  <div className=' field mb-3'>
                    <label
                      htmlFor='sylius_shop_checkout_address_billingAddress_phoneNumber'
                      className='form-label'
                    >
                      Phone number
                    </label>
                    <input
                      type='text'
                      id='sylius_shop_checkout_address_billingAddress_phoneNumber'
                      name='phoneNumber'
                      className='form-control'
                      value={billingAddress.phoneNumber}
                      onChange={handleChange}
                    />
                    {errors.phoneNumber && (
                      <div className='invalid-feedback d-block'>{errors.phoneNumber}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className='d-flex justify-content-between flex-column flex-sm-row gap-2'>
                <Link className='btn btn-light btn-icon' to='/'>
                  <svg
                    viewBox='0 0 24 24'
                    className='icon icon-sm flex-shrink-0'
                    aria-hidden='true'
                  >
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m15 6l-6 6l6 6'
                    />
                  </svg>
                  Back to store
                </Link>

                <button type='submit' className='btn btn-primary btn-icon' disabled={isSubmitting}>
                  Next{' '}
                  <svg viewBox='0 0 24 24' className='icon icon-sm' aria-hidden='true'>
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m9 6l6 6l-6 6'
                    />
                  </svg>
                </button>
              </div>

              <input
                type='hidden'
                id='sylius_shop_checkout_address__token'
                name='sylius_shop_checkout_address[_token]'
                data-controller='csrf-protection'
                value='5ffeca70aac9afcc7d21015eee1745df.P3reSeEhUg9ZiVTTtZFYYG2Cnsy0MFezzFYeXKGkve8.Si-cH5VJGW0I2ji63cACGiPOzr39Am-DvDVBb-yJ7KB1F5h5jUo_djbROw'
              />
            </form>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default AddressPage;
