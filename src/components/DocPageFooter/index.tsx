import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

const REPO = 'cfoust/vtdn.dev';

export default function DocPageFooter(): JSX.Element | null {
  const {metadata} = useDoc();
  const {editUrl} = metadata;

  const pageUrl = `https://vtdn.dev${metadata.permalink}`;
  const reportUrl =
    `https://github.com/${REPO}/issues/new?template=page-report.yml` +
    `&labels=page+report,needs+triage` +
    `&title=[Page+report]:+${encodeURIComponent(metadata.title)}` +
    `&page-url=${encodeURIComponent(pageUrl)}`;

  const sourceUrl = editUrl
    ? editUrl.replace('/edit/', '/blob/')
    : `https://github.com/${REPO}`;

  return (
    <footer className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.heading}>Help improve this page</h2>
        <p className={styles.description}>
          VTDN is an open source project. Help us make it better by
          contributing or reporting issues.
        </p>
        <div className={styles.actions}>
          <a
            href={sourceUrl}
            className={styles.linkButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
            View on GitHub
          </a>
          <a
            href={reportUrl}
            className={`${styles.linkButton} ${styles.reportButton}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="currentColor"
                d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
              />
            </svg>
            Report a problem
          </a>
        </div>
      </div>
    </footer>
  );
}
