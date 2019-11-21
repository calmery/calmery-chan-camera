import * as React from "react";
import styles from "./Footer.scss";

const Footer: React.FC = () => (
  <div className={styles.container}>
    Made with <span>—</span> by Calmery
  </div>
);

export { Footer };
