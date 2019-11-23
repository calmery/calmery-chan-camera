import * as React from "react";
import styles from "./Information.scss";

const Information: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.column}>
      <div className={styles.label}>お問い合わせについて！</div>
      <div className={styles.description}>
        ご要望、不具合は <a href="https://twitter.com/calmeryme">Calmery</a>{" "}
        まで！
      </div>
    </div>
    <div className={styles.column}>
      <div className={styles.label}>Special Thanks !</div>
      <div className={styles.description}>
        <div>
          イラスト <a href="https://twitter.com/metanen0x0">めたねのおくすり</a>{" "}
          さん
        </div>
        <div>
          ロゴ <a href="https://twitter.com/sorano_design">takumi</a> さん
        </div>
        <div>
          お手伝い <a href="https://twitter.com/Ryu1__1uyR">りゅう</a> くん
        </div>
      </div>
    </div>
  </div>
);

export { Information };
