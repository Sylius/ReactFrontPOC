import {json, LoaderFunction} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProductsList from "~/components/ProductsList";
import Layout from "~/layouts/Default";
import { Product } from "~/types/Product";

export const loader: LoaderFunction = async () => {
  const API_URL = process.env.PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/api/v2/shop/products?itemsPerPage=8`);

  if (!response.ok) {
    throw new Response("Error while loading products", { status: response.status });
  }

  const data = await response.json();
  const products: Product[] = data["hydra:member"] || data.items || data;

  return json({products, apiUrl: API_URL});
};

type LoaderData = {
  products: Product[];
  apiUrl: string;
};

export default function Homepage() {
  const { products, apiUrl } = useLoaderData<LoaderData>();

  return (
      <Layout>
        <div className="mb-5">
          <div className="overflow-hidden">
            <div className="d-flex justify-content-center align-items-center position-relative">
              <img
                  src={`${apiUrl}/build/shop/images/homepage-banner.8ec389de.webp`}
                  width="1920"
                  height="793"
                  className="img-fluid"
                  alt="Home"
              />
              <img
                  src={`${apiUrl}/build/shop/images/homepage-banner-logo.6759d0fb.webp`}
                  className="position-absolute"
                  style={{ maxWidth: "40vw" }}
                  alt="New collection"
              />
            </div>
          </div>
        </div>

        <div className="container mb-5">
          <ProductsList products={products} limit={4} name="Latest deals" />
        </div>

        <div className="container mb-5">
          <div className="mb-5">
            <h2>New collection</h2>
          </div>

          <div className="photo-grid">
            <div className="photo-grid-item-1">
              <img
                  src={`${apiUrl}/build/shop/images/homepage-new-collection-photo-1.2b163989.webp`}
                  className="object-fit-cover w-100 h-100 rounded-3"
                  loading="lazy"
                  alt="New collection"
              />
            </div>
            <div className="photo-grid-item-2">
              <img
                  src={`${apiUrl}/build/shop/images/homepage-new-collection-photo-2.2c91a0c3.webp`}
                  className="object-fit-cover w-100 h-100 rounded-3"
                  loading="lazy"
                  alt="New collection"
              />
            </div>
            <div className="photo-grid-item-3">
              <img
                  src={`${apiUrl}/build/shop/images/homepage-new-collection-photo-3.466a0c4c.webp`}
                  className="object-fit-cover w-100 h-100 rounded-3"
                  loading="lazy"
                  alt="New collection"
              />
            </div>
          </div>
        </div>

        <div className="container">
          <ProductsList products={products} limit={8} name="Latest products" />
        </div>
      </Layout>
  );
}
