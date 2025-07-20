import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook para manejar el input flotante móvil (teclado, scroll lock, altura, etc)
 */
export function useFloatingInput() {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const lastVisualViewportHeight = useRef<number | null>(null);

  // Detecta apertura/cierre del teclado móvil
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      if (window.visualViewport) {
        const vh = window.visualViewport.height;
        if (lastVisualViewportHeight.current !== null) {
          const delta = lastVisualViewportHeight.current - vh;
          // Si la diferencia es significativa, asumimos teclado abierto
          if (delta > 80) {
            setIsInputOpen(true);
            setKeyboardHeight(delta);
          } else if (delta < -80) {
            setIsInputOpen(false);
            setKeyboardHeight(0);
          }
        }
        lastVisualViewportHeight.current = vh;
        setViewportHeight(vh);
      } else {
        // Fallback para navegadores sin visualViewport
        setViewportHeight(window.innerHeight);
      }
    };
    window.visualViewport?.addEventListener("resize", onResize);
    window.addEventListener("resize", onResize);
    return () => {
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Lock scroll cuando el input está abierto
  useEffect(() => {
    if (isInputOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isInputOpen]);

  // Forzar scroll al fondo (opcional, para listas de mensajes)
  const scrollToBottom = useCallback((container?: HTMLElement | null) => {
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, []);

  return {
    isInputOpen,
    keyboardHeight,
    viewportHeight,
    scrollToBottom,
    setIsInputOpen,
  };
}
