import { RouteObject } from "react-router-dom";
import Homepage from "../pages/Homepage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/LoginPage";

export const coreRoutes: RouteObject[] = [
  { path: "/", element: <Homepage /> },
  { path: "cart", element: <CartPage /> },
  { path: "login", element: <LoginPage /> },
];
