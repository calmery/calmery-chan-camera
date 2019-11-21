import * as React from "react";
import styles from "./Header.scss";

const Header: React.FC = () => (
  <div className={styles.container}>
    <img className={styles.logo} src="images/logo.png" />
    <div className={styles.menu}>¯</div>
    <a href="https://calmery.moe">
      <div className={styles.menu}>A</div>
    </a>
  </div>
);

export { Header };
