import React, { useRef, useState } from "react";
import { useFloatingInput } from "../hooks/useFloatingInput";

interface FloatingInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  onSend,
  placeholder = "Escribe un mensaje...",
  disabled = false,
}) => {
  const [text, setText] = useState("");
  const [showRealInput, setShowRealInput] = useState(false);
  const [, forceRerender] = useState(0); // Para forzar re-render
  const inputRef = useRef<HTMLInputElement>(null);
  const { keyboardHeight } = useFloatingInput();

  const showFakeInput = () => {
    // Espera breve para que el teclado cierre y el viewport se estabilice
    setTimeout(() => {
      setShowRealInput(false);
      forceRerender((n) => n + 1);
    }, 80);
  };

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
      showFakeInput();
    }
  };

  // Enfoca el input real al mostrarlo
  React.useEffect(() => {
    if (showRealInput) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [showRealInput]);

  return (
    <>
      {showRealInput && (
        <div
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 99,
            background: "rgba(0,0,0,0.18)",
            transition: "background 0.2s",
            pointerEvents: "auto",
            touchAction: "none",
          }}
        />
      )}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          padding: "12px 16px env(safe-area-inset-bottom)",
          background: "rgba(255,255,255,0.98)",
          borderTop: "1px solid #eee",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
          transition: "padding-bottom 0.2s",
          paddingBottom: `calc(12px + env(safe-area-inset-bottom) + ${keyboardHeight}px)`,
        }}
      >
        {showRealInput ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: "flex", gap: 8 }}
            autoComplete="off"
          >
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              style={{
                flex: 1,
                borderRadius: 24,
                border: "1px solid #ccc",
                padding: "10px 16px",
                fontSize: 16,
                outline: "none",
                background: "#fafafa",
              }}
              autoFocus
              inputMode="text"
              enterKeyHint="send"
              onBlur={showFakeInput}
            />
            <button
              type="submit"
              disabled={disabled || !text.trim()}
              style={{
                border: "none",
                background: "#007aff",
                color: "#fff",
                borderRadius: 24,
                padding: "0 18px",
                fontWeight: 600,
                fontSize: 16,
                cursor: disabled || !text.trim() ? "not-allowed" : "pointer",
                opacity: disabled || !text.trim() ? 0.5 : 1,
                transition: "opacity 0.2s",
              }}
            >
              Enviar
            </button>
          </form>
        ) : (
          <div
            onClick={() => setShowRealInput(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 24,
              border: "1px solid #ccc",
              padding: "10px 16px",
              fontSize: 16,
              background: "#fafafa",
              color: "#888",
              cursor: "text",
              minHeight: 44,
              userSelect: "none",
            }}
          >
            {text || <span style={{ color: "#bbb" }}>{placeholder}</span>}
          </div>
        )}
      </div>
    </>
  );
};
