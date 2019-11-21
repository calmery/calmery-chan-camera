import * as React from "react";
import { useState, useRef, useLayoutEffect } from "react";
import classnames from "classnames";
import { ANIMATION_DURATION } from "../../constants";
import styles from "./Modal.scss";

interface ModalProps {
  children: React.ReactNode;
  hidden?: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, hidden }) => {
  const firstUpdate = useRef(true);
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const animationTimer = setTimeout(
      () => setIsAnimationCompleted(!isAnimationCompleted),
      ANIMATION_DURATION
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

export { Modal };
