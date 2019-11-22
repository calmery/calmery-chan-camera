import * as React from "react";
import styles from "./Footer.scss";

const Footer: React.FC = () => (
  <div className={styles.container}>
    Made with <img src="heart.svg" /> by Calmery
  </div>
);

export { Footer };
