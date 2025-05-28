import { useRoutes } from "react-router-dom";
import { accountRoutes } from "./accountRoutes";
import { checkoutRoutes, thankYouRoute, payOrderRoute } from "./checkoutRoutes";
import { coreRoutes } from "./coreRoutes";
import { productRoutes } from "./productRoutes";

const AppRoutes = () => {
  return useRoutes([
    ...coreRoutes,
    ...productRoutes,
    checkoutRoutes,
    thankYouRoute,
    payOrderRoute,
    accountRoutes,
  ]);
};

export default AppRoutes;
