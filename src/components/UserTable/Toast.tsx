import React, { useEffect, useState } from "react";
import styles from "./UserTable.module.css";
import type { ToastProps } from "./types";

const Toast: React.FC<ToastProps> = ({ message, visible, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      setIsAnimatingOut(false);
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
        setTimeout(onClose, 200); // Match animation duration
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`
      ${styles.toast} 
      ${!isAnimatingOut ? styles.toastVisible : styles.toastHidden}
    `}
    >
      <div className={styles.toastContent}>
        <span className={styles.toastIcon}>✓</span>
        <p>{message}</p>
        <button
          onClick={() => {
            setIsAnimatingOut(true);
            setTimeout(onClose, 200);
          }}
          className={styles.toastClose}
          aria-label="Dismiss notification"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
