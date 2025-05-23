import { RouteObject } from "react-router-dom";
import Homepage from "../pages/Homepage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/account/LoginPage.tsx";
import RegisterPage from "../pages/account/RegisterPage.tsx";
import RegisterThankYouPage from "../pages/account/RegisterThankYouPage.tsx";
import VerificationPage from "../pages/account/VerificationPage.tsx"; //

export const coreRoutes: RouteObject[] = [
  { path: "/", element: <Homepage /> },
  { path: "cart", element: <CartPage /> },
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { path: "register/thank-you", element: <RegisterThankYouPage /> },
  { path: "verify", element: <VerificationPage /> },
];
