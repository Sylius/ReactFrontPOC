import React, { createContext, useContext, useState, useCallback } from "react";
import FlashMessages from "../components/layout/FlashMessages.tsx";

type FlashMessageType = "success" | "error" | "info" | "warning";

type FlashMessage = {
  id: string;
  type: FlashMessageType;
  content: string;
};

type FlashMessagesContextType = {
  messages: FlashMessage[];
  addMessage: (type: FlashMessageType, content: string) => void;
  removeMessage: (id: string) => void;
};

const FlashMessagesContext = createContext<
  FlashMessagesContextType | undefined
>(undefined);

export const FlashMessagesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<FlashMessage[]>([]);

  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const addMessage = useCallback(
    (type: FlashMessageType, content: string) => {
      const id = Date.now().toString();
      const message: FlashMessage = { id, type, content };
      setMessages((prev) => [...prev, message]);

      setTimeout(() => {
        removeMessage(id);
      }, 10000);
    },
    [removeMessage],
  );

  return (
    <FlashMessagesContext.Provider
      value={{ messages, addMessage, removeMessage }}
    >
      {children}
      <FlashMessages messages={messages} removeMessage={removeMessage} />
    </FlashMessagesContext.Provider>
  );
};

export const useFlashMessages = (): FlashMessagesContextType => {
  const context = useContext(FlashMessagesContext);
  if (!context) {
    throw new Error(
      "useFlashMessages must be used within a FlashMessagesProvider",
    );
  }
  return context;
};
