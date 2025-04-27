import { type FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Taxon, TaxonChild } from '@/types/Taxon';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { apiFetch } from '@/utils/apiFetch';

const Navbar: FC = () => {
  const [taxons, setTaxons] = useState<Taxon[]>([]);
  const [childrenMap, setChildrenMap] = useState<Record<number, TaxonChild[]>>({});

  useEffect(() => {
    const fetchTaxons = async () => {
      try {
        const res = await apiFetch('/api/v2/shop/taxons');
        const json = await res.json();
        const data: Taxon[] = json['hydra:member'] || [];

        setTaxons(data);

        const childrenResults = await Promise.all(
          data.map(async (taxon) => {
            const childObjects: TaxonChild[] = await Promise.all(
              taxon.children.map(async (childUrl) => {
                const res = await apiFetch(childUrl);
                return await res.json();
              }),
            );
            return { taxonId: taxon.id, children: childObjects };
          }),
        );

        const map: Record<number, TaxonChild[]> = {};
        childrenResults.forEach(({ taxonId, children }) => {
          map[taxonId] = children;
        });

        setChildrenMap(map);
      } catch (err) {
        console.error('Błąd ładowania kategorii:', err);
      }
    };

    fetchTaxons();
  }, []);

  return (
    <div className='w-100 border-bottom'>
      <nav className='navbar offcanvas-lg offcanvas-start offcanvas-wide p-0' id='navbarNav'>
        <div className='offcanvas-header w-100'>
          <h5 className='offcanvas-title'>Taxons</h5>
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='offcanvas'
            data-bs-target='#navbarNav'
            aria-label='Close'
          />
        </div>

        <div className='offcanvas-body justify-content-lg-center w-100 py-0'>
          <div className='navbar-nav my-2 flex-column flex-lg-row gap-lg-4'>
            {taxons.map((taxon) => {
              const hasChildren = childrenMap[taxon.id]?.length > 0;

              return hasChildren ? (
                <div key={taxon.id} className='nav-item dropdown position-relative'>
                  <button
                    type='button'
                    className='nav-link d-flex align-items-center gap-1'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    {taxon.name}
                    <svg viewBox='0 0 24 24' className='icon icon-sm' aria-hidden='true'>
                      <path
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='m6 9l6 6l6-6'
                      />
                    </svg>
                  </button>

                  <div className='dropdown-menu position-absolute border dropdown-custom '>
                    {childrenMap[taxon.id].map((child) => (
                      <Link
                        key={child.id}
                        className='nav-link nav-link-padding'
                        to={`/${taxon.code}/${child.code}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={taxon.id}
                  className='nav-link d-flex align-items-center'
                  to={`/${taxon.slug}`}
                >
                  {taxon.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
