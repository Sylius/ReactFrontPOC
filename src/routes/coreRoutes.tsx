import { RouteObject } from "react-router-dom";
import Homepage from "../pages/Homepage";
import CartPage from "../pages/CartPage";
import LoginPage from "../pages/account/LoginPage";
import RegisterPage from "../pages/account/RegisterPage";
import RegisterThankYouPage from "../pages/account/RegisterThankYouPage";
import VerificationPage from "../pages/account/VerificationPage";
import ForgottenPasswordPage from "../pages/account/ForgottenPasswordPage";
import ResetPasswordPage from "../pages/account/ResetPasswordPage";

export const coreRoutes: RouteObject[] = [
  { path: "/", element: <Homepage /> },
  { path: "cart", element: <CartPage /> },
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
  { path: "register/thank-you", element: <RegisterThankYouPage /> },
  { path: "verify", element: <VerificationPage /> },
  { path: "forgotten-password", element: <ForgottenPasswordPage /> },
  { path: "forgotten-password/reset", element: <ResetPasswordPage /> },
];
