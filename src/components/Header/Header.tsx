import * as React from "react";
import styles from "./Header.scss";

interface IHeaderProps {
  onClickInfomrationButton: () => void;
}

const Header: React.FC<IHeaderProps> = ({ onClickInfomrationButton }) => (
  <div className={styles.container}>
    <img className={styles.logo} src="images/logo.png" />
    <div className={styles.menu} onClick={onClickInfomrationButton}>
      <img src="information.svg" />
    </div>
    <a href="https://calmery.moe">
      <div className={styles.menu}>
        <img src="home.svg" />
      </div>
    </a>
  </div>
);

export { Header };
