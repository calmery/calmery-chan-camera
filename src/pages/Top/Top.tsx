import * as React from "react";
import ReactGA from "react-ga";
import Canvas from "../../containers/Canvas";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import styles from "./Top.scss";

class Top extends React.Component {
  public componentDidMount = () => {
    ReactGA.pageview(window.location.pathname);
  };

  public render = () => (
    <React.Fragment>
      <Header />
      <div className={styles.contents}>
        <Canvas />
      </div>
      <Footer />
    </React.Fragment>
  );
}

export default Top;
