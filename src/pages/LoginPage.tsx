import { type FC, useState } from 'react';
import Default from '@/layouts/Default';
import { useCustomer } from '@/context/CustomerContext';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/utils/apiFetch';

const LoginPage: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetchCustomer } = useCustomer();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/api/v2/shop/customers/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      localStorage.setItem('jwtToken', data.token);
      localStorage.setItem('userUrl', data.customer);

      await refetchCustomer();

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Default>
      <div className='container my-auto'>
        <div className='row my-4'>
          <div className='col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-0 col-xl-4 offset-xl-1 order-lg-1'>
            <div className='d-flex justify-content-center align-items-center h-100 px-3'>
              <div className='w-100 py-lg-5 mb-5 my-lg-5'>
                <h1 className='h2 mb-5'>Login</h1>
                <form onSubmit={handleLogin} noValidate={true}>
                  {error && (
                    <div className='alert alert-danger'>
                      <div className='fw-bold'>Error</div>
                      {error}
                    </div>
                  )}

                  <div className='mb-5'>
                    <div className=' field mb-3 required'>
                      <label htmlFor='_username' className='form-label required'>
                        Username
                      </label>
                      <input
                        type='text'
                        id='_username'
                        name='_username'
                        required={true}
                        className='form-control'
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className=' field mb-3 required'>
                      <label htmlFor='_password' className='form-label required'>
                        Password
                      </label>
                      <input
                        type='password'
                        id='_password'
                        name='_password'
                        required={true}
                        className='form-control'
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <div className='form-check'>
                        <input
                          type='checkbox'
                          id='_remember_me'
                          name='_remember_me'
                          className='form-check-input'
                          value='1'
                        />
                        <label className='form-check-label' htmlFor='_remember_me'>
                          Remember me
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className='d-grid mb-2'>
                    <button
                      type='submit'
                      className='btn btn-primary'
                      id='login-button'
                      disabled={loading}
                    >
                      Login
                    </button>
                  </div>

                  <input
                    type='hidden'
                    name='_csrf_shop_security_token'
                    value='9e18bb83adf067700.UOv6APT67VeoTTEJqhaKHvRW9u1qj7WrPIqcU94-HXc.YN7NTJuq2xCZAQJFz3PaeNk_g6RTyvjefdrfEIx0WRMhucotpImUbsY7aA'
                  />
                </form>

                <div className='d-grid'>
                  <a className='btn btn-link' href='/forgotten-password'>
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className='col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-0 order-lg-0'>
            <div className='d-flex flex-column justify-content-center align-items-center bg-light rounded-4 h-100 p-3'>
              <div className='text-center'>
                <div className='mb-3'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='144px'
                    viewBox='0 -960 960 960'
                    width='144px'
                    fill='#e8eaed'
                  >
                    <title>Sylius</title>
                    <path d='M266-586h337v-85q0-51.25-35.82-87.13-35.83-35.87-87-35.87Q429-794 393-758.13q-36 35.88-36 87.13h-22q0-61 42.17-103 42.18-42 103-42Q541-816 583-773.88T625-671v85h69q21.75 0 37.88 15.74Q748-554.53 748-532v346q0 21.75-16.12 37.87Q715.75-132 694-132H266q-21.75 0-37.87-16.13Q212-164.25 212-186v-346q0-22.53 16.13-38.26Q244.25-586 266-586Zm0 432h428q14 0 23-9t9-23v-346q0-14-9-23t-23-9H266q-14 0-23 9t-9 23v346q0 14 9 23t23 9Zm214.17-152q21.83 0 37.33-15.53T533-359q0-21-15.67-37t-37.5-16q-21.83 0-37.33 16T427-358.5q0 21.5 15.67 37t37.5 15.5ZM234-154v-410 410Z' />
                  </svg>
                </div>
                <h2>Don't have an account?</h2>
                <a className='btn btn-link' id='register-here-button' href='/register'>
                  Register here
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Default>
  );
};

export default LoginPage;
