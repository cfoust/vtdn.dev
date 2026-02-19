import React from 'react';
import styles from './styles.module.css';

type Status = {
  experimental?: boolean;
  standard_track?: boolean;
  deprecated?: boolean;
};

export default function StatusBadges({status}: {status?: Status}) {
  if (!status) return null;

  const badges: Array<{label: string; className: string}> = [];

  if (status.deprecated) {
    badges.push({label: 'Deprecated', className: styles.deprecated});
  }
  if (status.experimental) {
    badges.push({label: 'Experimental', className: styles.experimental});
  }
  if (status.standard_track) {
    badges.push({label: 'Standard', className: styles.standard});
  }

  if (badges.length === 0) return null;

  return (
    <div className={styles.badges}>
      {badges.map((b) => (
        <span key={b.label} className={`${styles.badge} ${b.className}`}>
          {b.label}
        </span>
      ))}
    </div>
  );
}
