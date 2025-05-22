import React from "react";
import { CustomerProvider } from "../context/CustomerContext";
import { OrderProvider } from "../context/OrderContext";
import { FlashMessagesProvider } from "../context/FlashMessagesContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <CustomerProvider>
      <OrderProvider>
        <FlashMessagesProvider>{children}</FlashMessagesProvider>
      </OrderProvider>
    </CustomerProvider>
  );
};

export default AppProviders;
