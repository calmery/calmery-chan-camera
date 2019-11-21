import * as React from "react";
import Canvas from "../../containers/Canvas";
import { Header } from "../../components/Header";
import styles from "./Top.scss";

const Top: React.FC = () => (
  <div className={styles.container}>
    <Header />
  </div>
);

export default Top;
