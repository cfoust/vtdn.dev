import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

import terminals from '../../../data/terminals.json';
import controlSequences from '../../../data/control-sequences.json';
import csiSequences from '../../../data/csi-sequences.json';
import textStyling from '../../../data/text-styling.json';
import oscSequences from '../../../data/osc-sequences.json';
import dcsSequences from '../../../data/dcs-sequences.json';
import decsetModes from '../../../data/decset-modes.json';
import keyboardInput from '../../../data/keyboard-input.json';
import graphics from '../../../data/graphics.json';
import windowManipulation from '../../../data/window-manipulation.json';

const categories = [
  controlSequences.control_sequences,
  csiSequences.csi_sequences,
  textStyling.text_styling,
  oscSequences.osc_sequences,
  dcsSequences.dcs_sequences,
  decsetModes.decset_modes,
  keyboardInput.keyboard_input,
  graphics.graphics,
  windowManipulation.window_manipulation,
];

const terminalIds = Object.keys(terminals);

const icons: Record<string, React.ReactNode> = {
  alacritty: (
    <svg viewBox="0 0 64 64" fill="currentColor" className={styles.terminalIcon}>
      <path d="M27.09 2.86h9.82L58.64 56.79H49.52L32 15.6 14.48 56.79H5.36Z"/>
      <path d="M27.57 38.79 32 28.05l4.43 10.74 1.39 3.37C34.09 53.67 34.09 53.67 32 63.72c-2.09-10.04-2.09-10.04-5.83-21.55z"/>
    </svg>
  ),
  foot: (
    <svg viewBox="20 18 34 56" fill="currentColor" className={styles.terminalIcon}>
      <path d="M35.15 31.54a18 18 0 0 0-2.33-.43c-3.52-.34-4.66-.03-6.43 1.76-2.44 2.44-1.94 5.92 1.26 8.9 6.93 6.45 7.04 10.78.41 15.66-2.73 2.01-4.7 6.73-3.86 9.16 1.07 3.11 5.15 4.3 8.71 2.55 3.34-1.65 7.12-7.28 9.71-13.02.21-.56.42-1.13.62-1.71a51 51 0 0 0 1.5-5.3c1.21-5.39.91-9.59-.85-12.11-1.1-1.58-5.19-3.6-8.73-4.5z"/>
      <ellipse cx="30.16" cy="25.86" rx="3.27" ry="3.86"/>
      <ellipse cx="36.43" cy="27.14" rx="2.14" ry="2.57"/>
      <ellipse cx="41.14" cy="29.48" rx="1.71" ry="1.95"/>
      <ellipse cx="44.89" cy="32.1" rx="1.39" ry="1.53"/>
      <ellipse cx="46.86" cy="35.29" rx="1.14" ry="1.29"/>
    </svg>
  ),
  windows_terminal: (
    <svg viewBox="0 0 16 16" fill="currentColor" className={styles.terminalIcon}>
      <path d="M2.15 3.65a.5.5 0 0 1 .7 0l4.5 4.5a.5.5 0 0 1 0 .7l-4.5 4.5a.5.5 0 0 1-.7-.7L6.3 8.5 2.15 4.35a.5.5 0 0 1 0-.7z"/>
      <rect x="8" y="12" width="6" height="1.5" rx=".5"/>
    </svg>
  ),
};

type SupportEntry = {
  version_added: string | boolean | null;
  partial_implementation?: boolean;
  notes?: string;
};

function SupportCell({support}: {support: SupportEntry}) {
  const {version_added, partial_implementation, notes} = support;

  if (partial_implementation) {
    return (
      <td className={styles.partial} title={notes}>
        ~
      </td>
    );
  }

  if (typeof version_added === 'string') {
    return (
      <td className={styles.yes} title={notes}>
        {version_added}
      </td>
    );
  }

  if (version_added === true) {
    return (
      <td className={notes ? styles.yesNotes : styles.yes} title={notes}>
        &#x2713;
      </td>
    );
  }

  if (version_added === false) {
    return (
      <td className={styles.no}>
        &#x2717;
      </td>
    );
  }

  return (
    <td className={styles.unknown}>
      ?
    </td>
  );
}

export default function CompatibilityMatrix(): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <table className={styles.matrix}>
        <thead>
          <tr>
            <th className={styles.featureHeader}>Feature</th>
            {terminalIds.map((id) => (
              <th key={id} className={styles.terminalHeader}>
                <a
                  href={terminals[id].website}
                  target="_blank"
                  rel="noopener noreferrer">
                  {icons[id] || <span className={styles.terminalIconSpacer} />}
                  {terminals[id].name}
                </a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const meta = category.__meta;
            const features = Object.entries(category).filter(
              ([key]) => key !== '__meta',
            );

            return (
              <React.Fragment key={meta.category}>
                <tr className={styles.categoryRow}>
                  <td
                    colSpan={terminalIds.length + 1}
                    className={styles.categoryCell}>
                    {meta.category}
                  </td>
                </tr>
                {features.map(([featureId, feature]) => {
                  const compat = (feature as any).__compat;
                  return (
                    <tr key={featureId}>
                      <td className={styles.featureCell}>
                        <Link to={compat.doc_path}>{compat.title}</Link>
                        <span className={styles.featureDesc}>{compat.description}</span>
                      </td>
                      {terminalIds.map((termId) => (
                        <SupportCell
                          key={termId}
                          support={compat.support[termId]}
                        />
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
