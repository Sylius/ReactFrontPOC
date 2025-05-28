import React from "react";
import { IconX } from "@tabler/icons-react";

type FlashMessages = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  content: string;
};

type Props = {
  messages: FlashMessages[];
  removeMessage: (id: string) => void;
};

const FlashMessages: React.FC<Props> = ({ messages, removeMessage }) => {
  return (
    <div className="d-flex flex-column gap-2 container fixed-top mt-5 ">
      {messages.map((msg) => (
        <div
          className={`alert alert-${msg.type === "error" ? "danger" : msg.type} my-0`}
          role="alert"
          key={msg.id}
        >
          <div className="d-flex justify-content-between">
            <div className="fw-bold">{msg.type.toUpperCase()}</div>
            <span
              className="close flash-message-close"
              onClick={() => removeMessage(msg.id)}
              aria-label="Close"
            >
              <IconX stroke={2} />
            </span>
          </div>
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  );
};

export default FlashMessages;
