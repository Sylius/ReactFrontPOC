import type { FC } from 'react';
import { useCustomer } from '@/context/CustomerContext';
import AccountLayout from '@/layouts/Account';
import Default from '@/layouts/Default';

const DashboardPage: FC = () => {
  const { customer } = useCustomer();

  return (
    <Default>
      <AccountLayout>
        <div className='col-12 col-md-9'>
          <div className='mb-4'>
            <h1>My account</h1>
            Manage your personal information and preferences
          </div>

          <div className='card border-0 bg-body-tertiary'>
            <div className='card-body'>
              <div className='row mb-3'>
                <div className='col-12 col-sm-auto mb-2 order-sm-1'>
                  {customer?.user?.verified ? (
                    <span className='badge text-bg-success'>Verified</span>
                  ) : (
                    <span className='badge text-bg-danger'>Not verified</span>
                  )}
                </div>

                <div className='col-12 col-sm'>
                  <strong>{customer?.fullName}</strong>

                  <div>{customer?.email}</div>
                </div>
              </div>

              <div className='d-flex flex-column align-items-center flex-sm-row gap-2'>
                <a href='/' className='btn btn-sm btn-icon btn-outline-gray'>
                  <svg viewBox='0 0 24 24' className='icon icon-xs' aria-hidden='true'>
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16zm9.5-13.5l4 4'
                    />
                  </svg>
                  Edit
                </a>

                <a href='/' className='btn btn-sm btn-icon btn-outline-gray'>
                  <svg viewBox='0 0 24 24' className='icon icon-xs' aria-hidden='true'>
                    <g
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                    >
                      <path d='M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z' />
                      <path d='M11 16a1 1 0 1 0 2 0a1 1 0 0 0-2 0m-3-5V7a4 4 0 1 1 8 0v4' />
                    </g>
                  </svg>
                  Change password
                </a>

                {!customer?.user?.verified && (
                  <form action='/verify' method='post'>
                    <button
                      className='btn btn-sm btn-icon btn-outline-gray text-primary'
                      type='submit'
                    >
                      <svg viewBox='0 0 24 24' className='icon icon-xs' aria-hidden='true'>
                        <path
                          fill='none'
                          stroke='currentColor'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='m5 12l5 5L20 7'
                        />
                      </svg>
                      Verify
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </AccountLayout>
    </Default>
  );
};

export default DashboardPage;
