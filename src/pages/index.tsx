import React from 'react';
import Layout from '@theme/Layout';
import CompatibilityMatrix from '../components/CompatibilityMatrix';
import styles from './index.module.css';

export default function Home(): React.ReactElement {
  return (
    <Layout
      noFooter
      title="Compatibility Matrix"
      description="Terminal emulator standards compatibility reference">
      <main className={styles.main}>
        <CompatibilityMatrix />
      </main>
    </Layout>
  );
}
