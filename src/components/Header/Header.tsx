import * as React from "react";
import styles from "./Header.scss";

interface IHeaderProps {
  onClickInfomrationButton: () => void;
}

const Header: React.FC<IHeaderProps> = ({ onClickInfomrationButton }) => (
  <div className={styles.container}>
    <img className={styles.logo} src="images/logo.png" alt="ロゴ" />
    <div className={styles.menu} onClick={onClickInfomrationButton}>
      <img src="images/information.svg" alt="情報" />
    </div>
    <a href="https://calmery.moe">
      <div className={styles.menu}>
        <img src="images/home.svg" alt="トップに戻る" />
      </div>
    </a>
  </div>
);

export { Header };
