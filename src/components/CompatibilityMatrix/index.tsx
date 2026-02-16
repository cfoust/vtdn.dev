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
