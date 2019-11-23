import * as React from "react";
import ReactGA from "react-ga";
import Canvas from "../../containers/Canvas";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Modal } from "../../containers/Modal";
import { Information } from "../../components/Information";
import styles from "./Top.scss";

interface ITopState {
  isOpenInformation: boolean;
}

class Top extends React.Component<{}, ITopState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isOpenInformation: false
    };
  }

  public componentDidMount = () => {
    ReactGA.pageview(window.location.pathname);
  };

  public render = () => {
    const { isOpenInformation } = this.state;

    return (
      <React.Fragment>
        <Header
          onClickInfomrationButton={() => {
            this.setState({ isOpenInformation: true });
          }}
        />
        <div className={styles.contents}>
          <Canvas />
        </div>
        <Footer />
        <Modal
          hidden={!isOpenInformation}
          onClose={() => {
            this.setState({ isOpenInformation: false });
          }}
        >
          <div
            className={styles.closeInformationButton}
            onClick={this.onCloseInformation}
          >
            <img src="images/arrow.svg" />
          </div>
          <Information />
        </Modal>
      </React.Fragment>
    );
  };

  private onCloseInformation = () => {
    this.setState({ isOpenInformation: false });
  };
}

export default Top;
