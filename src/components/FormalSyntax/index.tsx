import React from 'react';
import styles from './styles.module.css';

export default function FormalSyntax({grammar}: {grammar: string}) {
  if (!grammar) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>Formal syntax</div>
      <pre className={styles.grammar}>{grammar.trim()}</pre>
    </div>
  );
}
