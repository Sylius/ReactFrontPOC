import ProductList from "../pages/ProductList";
import ProductPage from "../pages/ProductPage";
import AddReviewPage from "../pages/Product/AddReviewPage";
import ReviewsListPage from "../pages/Product/ReviewsListPage";

export const productRoutes = [
  { path: "/:parentCode", element: <ProductList /> },
  { path: "/:parentCode/:childCode", element: <ProductList /> },
  { path: "/product/:code", element: <ProductPage /> },
  { path: "/product/:code/review/new", element: <AddReviewPage /> },
  { path: "/product/:code/reviews", element: <ReviewsListPage /> },
];
