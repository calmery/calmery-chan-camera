import * as React from "react";
import { useState, useEffect } from "react";
import classnames from "classnames";
import styles from "./Modal.scss";

interface ModalProps {
  children: React.ReactNode;
  hidden?: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, hidden }) => {
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(
      () => setIsAnimationCompleted(!isAnimationCompleted),
      400
    );
    return () => clearTimeout(animationTimer);
  }, [hidden]);

  return (
    <div
      className={classnames(styles.container, {
        [styles.hidden]: hidden && isAnimationCompleted
      })}
    >
      <div
        className={classnames(styles.background, {
          fadeIn: !hidden,
          fadeOut: hidden
        })}
      ></div>
      <div
        className={classnames(styles.children, {
          fadeInUp: !hidden,
          fadeOutDown: hidden
        })}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
