import React from 'react';
import Layout from '@theme/Layout';
import CompatibilityMatrix from '../components/CompatibilityMatrix';
import styles from './index.module.css';

export default function Home(): React.ReactElement {
  return (
    <Layout
      title="Compatibility Matrix"
      description="Terminal emulator standards compatibility reference">
      <header className={styles.hero}>
        <h1>vtdn.dev</h1>
        <p>
          A compatibility reference for terminal emulator standards and
          protocols, covering escape sequences, graphics, keyboard input, and
          modern extensions.
        </p>
      </header>
      <main className={styles.main}>
        <CompatibilityMatrix />
        <div className={styles.legend}>
          <h3>Legend</h3>
          <ul>
            <li>
              <span className={styles.legendYes}>&#x2713;</span> Supported
            </li>
            <li>
              <span className={styles.legendNo}>&#x2717;</span> Not supported
            </li>
            <li>
              <span className={styles.legendPartial}>~</span> Partial support
              (hover for details)
            </li>
            <li>
              <span className={styles.legendUnknown}>?</span> Unknown
            </li>
            <li>
              <span className={styles.legendVersion}>1.2.0</span> Supported
              since version
            </li>
          </ul>
        </div>
      </main>
    </Layout>
  );
}
