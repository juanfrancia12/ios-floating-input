import React, { useRef, useState, useEffect } from "react";
import { FloatingInput } from "./FloatingInput";
import { useFloatingInput } from "../hooks/useFloatingInput";

export const ChatDemo: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollToBottom, keyboardHeight } = useFloatingInput();

  useEffect(() => {
    scrollToBottom(listRef.current);
  }, [messages, keyboardHeight, scrollToBottom]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100dvh",
        background: "#f5f5f5",
        paddingBottom: 80, // Espacio para el input flotante
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        ref={listRef}
        style={{
          overflowY: "auto",
          maxHeight: "calc(100dvh - 80px)",
          padding: "16px 0 16px 0",
          marginBottom: 0,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: "#aaa", textAlign: "center", marginTop: 40 }}>
            ¡Empieza la conversación!
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "10px 16px",
                margin: "8px 16px",
                alignSelf: "flex-end",
                maxWidth: "80%",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}
            >
              {msg}
            </div>
          ))
        )}
      </div>
      <FloatingInput
        onSend={(text) => setMessages((msgs) => [...msgs, text])}
        placeholder="Escribe un mensaje..."
      />
    </div>
  );
};
