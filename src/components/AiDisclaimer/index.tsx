import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Admonition from '@theme/Admonition';

const REPO = 'cfoust/vtdn.dev';

export default function AiDisclaimer(): JSX.Element {
  const {metadata} = useDoc();
  const pageUrl = `https://vtdn.dev${metadata.permalink}`;
  const reportUrl =
    `https://github.com/${REPO}/issues/new?template=page-report.yml` +
    `&labels=page+report,needs+triage` +
    `&title=[Page+report]:+${encodeURIComponent(metadata.title)}` +
    `&page-url=${encodeURIComponent(pageUrl)}`;

  return (
    <Admonition type="warning" title="AI-Generated Content">
      This page was generated with the assistance of AI and may contain
      inaccuracies. It is intended as a placeholder for future human
      verification. If you spot issues ahead of its initial review, please{' '}
      <a href={reportUrl} target="_blank" rel="noopener noreferrer">
        report them on GitHub
      </a>
      !
    </Admonition>
  );
}
