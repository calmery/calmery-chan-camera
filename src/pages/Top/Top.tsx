import * as React from "react";
import Canvas from "../../containers/Canvas";
import styles from "./Top.scss";

const Top: React.FC = () => (
  <React.Fragment>
    <div className={styles.logo}>
      <img src="logo.png" />
    </div>
    <Canvas />
  </React.Fragment>
);

export default Top;
