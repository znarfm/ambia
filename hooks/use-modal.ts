import { useState, useEffect, useCallback } from "react";
import { useWebHaptics } from "web-haptics/react";

interface UseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function useModal({ isOpen, onClose }: UseModalProps) {
  const haptic = useWebHaptics();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimate, setIsAnimate] = useState(false);

  const handleClose = useCallback(() => {
    haptic.trigger("light");
    setIsAnimate(false);
    setTimeout(onClose, 500);
  }, [onClose, haptic]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      // Defer to avoid cascading render error
      const frame = requestAnimationFrame(() => setIsAnimate(false));
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(timer);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, handleClose]);

  return {
    shouldRender,
    isAnimate,
    handleClose,
  };
}
