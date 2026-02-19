import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';
import {
  terminals,
  terminalIds,
  buildGroupHeaders,
  classifySupport,
  getFeature,
  type SupportEntry,
} from '../../lib/compatData';

function SupportIcon({kind}: {kind: string}) {
  switch (kind) {
    case 'yes':
      return <span className={styles.yes}>&#x2713;</span>;
    case 'partial':
      return <span className={styles.partial}>~</span>;
    case 'no':
      return <span className={styles.no}>&#x2717;</span>;
    default:
      return <span className={styles.unknown}>?</span>;
  }
}

function versionDisplay(support: SupportEntry): string {
  if (typeof support.version_added === 'string') return support.version_added;
  if (support.version_added === true) return 'Yes';
  if (support.version_added === false) return 'No';
  return '?';
}

export default function FeatureCompatTable({
  featureId,
  dataFile,
}: {
  featureId?: string;
  dataFile?: string;
}) {
  const {frontMatter} = useDoc();
  const resolvedFeatureId = featureId ?? (frontMatter as any).feature_id;
  const resolvedDataFile = dataFile ?? (frontMatter as any).data_file;

  if (!resolvedFeatureId || !resolvedDataFile) {
    return <p>Missing <code>feature_id</code> or <code>data_file</code> in front matter.</p>;
  }

  const feature = getFeature(resolvedDataFile, resolvedFeatureId);
  if (!feature) {
    return <p>Feature <code>{resolvedFeatureId}</code> not found in <code>{resolvedDataFile}</code>.</p>;
  }

  const {support} = feature.__compat;
  const groupHeaders = buildGroupHeaders();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Terminal</th>
          <th>Support</th>
          <th>Version</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {groupHeaders.map((group) => {
          const groupTerminals = terminalIds.filter((id) => {
            const g = (terminals[id] as any).group || null;
            return g === group.label;
          });

          return (
            <React.Fragment key={group.label || 'ungrouped'}>
              {group.label && (
                <tr className={styles.groupRow}>
                  <td colSpan={4} className={styles.groupCell}>
                    {group.label}
                  </td>
                </tr>
              )}
              {groupTerminals.map((termId) => {
                const entry: SupportEntry = support[termId] || {version_added: null};
                const kind = classifySupport(entry);
                return (
                  <tr key={termId}>
                    <td>
                      <a
                        href={(terminals[termId] as any).website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {(terminals[termId] as any).name}
                      </a>
                    </td>
                    <td className={styles.supportCell}>
                      <SupportIcon kind={kind} />
                    </td>
                    <td className={styles.versionCell}>{versionDisplay(entry)}</td>
                    <td className={styles.notesCell}>{entry.notes || ''}</td>
                  </tr>
                );
              })}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
