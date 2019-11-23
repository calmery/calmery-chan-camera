import * as React from "react";
import { useState, useRef, useLayoutEffect } from "react";
import classnames from "classnames";
import { ANIMATION_DURATION } from "../../constants";
import styles from "./ErrorMessage.scss";

interface ModalProps {
  children: React.ReactNode;
  hidden?: boolean;
  onClick: () => void;
}

const ErrorMessage: React.FC<ModalProps> = ({ children, hidden, onClick }) => {
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
          bounceIn: !hidden,
          bounceOut: hidden
        })}
      >
        <div className={styles.errorContainer}>
          <img src="layers/22.png" alt="失敗した" />
          <div className={styles.errorMessage}>{children}</div>
          <div className={styles.okButton} onClick={() => onClick()}>
            わかった
          </div>
        </div>
      </div>
    </div>
  );
};

export { ErrorMessage };
