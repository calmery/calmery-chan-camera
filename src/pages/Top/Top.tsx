import * as React from "react";
import Canvas from "../../containers/Canvas";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import styles from "./Top.scss";

const Top: React.FC = () => (
  <div className={styles.container}>
    <Header />
    <div className={styles.contents}>
      <Canvas />
    </div>
    <Footer />
  </div>
);

export default Top;
