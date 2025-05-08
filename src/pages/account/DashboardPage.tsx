import type { FC } from 'react';
import Default from '@/layouts/Default';
import AccountLayout from '@/layouts/Account';
import { useCustomer } from '@/context/CustomerContext';
import { IconPencil, IconLock, IconCheck } from '@tabler/icons-react';

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
                <a href='#' className='btn btn-sm btn-icon btn-outline-gray'>
                  <IconPencil stroke={2} size={16} />
                  Edit
                </a>

                <a href='#' className='btn btn-sm btn-icon btn-outline-gray'>
                  <IconLock stroke={2} size={16} />
                  Change password
                </a>

                {!customer?.user?.verified && (
                  <form action='/en_US/verify' method='post'>
                    <button
                      className='btn btn-sm btn-icon btn-outline-gray text-primary'
                      type='submit'
                    >
                      <IconCheck stroke={2} size={16} />
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
