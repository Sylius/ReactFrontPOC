import { RouteObject } from "react-router-dom";
import RequireAuth from "./guards/RequireAuth";
import DashboardPage from "../pages/account/DashboardPage";
import OrderHistoryPage from "../pages/account/OrderHistoryPage";
import OrderDetailsPage from "../pages/account/OrderDetailsPage";
import PayOrderPage from "../pages/Checkout/PayOrderPage";
import ProfilePage from "../pages/account/ProfilePage";
import AddressBookPage from "../pages/account/AddressBookPage";
import AddAddressPage from "../pages/account/AddAddressPage";
import EditAddressPage from "../pages/account/EditAddressPage";
import ChangePasswordPage from "../pages/account/ChangePasswordPage";

export const accountRoutes: RouteObject = {
  path: "account",
  element: <RequireAuth />,
  children: [
    { path: "dashboard", element: <DashboardPage /> },
    { path: "profile/edit", element: <ProfilePage /> },
    { path: "change-password", element: <ChangePasswordPage /> },
    { path: "order-history", element: <OrderHistoryPage /> },
    {
      path: "orders/:token",
      children: [
        { index: true, element: <OrderDetailsPage /> },
        { path: "pay", element: <PayOrderPage /> },
      ],
    },
    { path: "address-book", element: <AddressBookPage /> },
    { path: "address-book/add", element: <AddAddressPage /> },
    { path: "address-book/edit/:id", element: <EditAddressPage /> },
  ],
};
