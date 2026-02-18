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

// Sort terminals alphabetically by name within each group, preserving group order
const terminalIds = (() => {
  const ids = Object.keys(terminals);
  const groups: string[][] = [];
  for (const id of ids) {
    const group = (terminals[id] as any).group || null;
    const last = groups[groups.length - 1];
    if (last && (terminals[last[0]] as any).group === group) {
      last.push(id);
    } else {
      groups.push([id]);
    }
  }
  return groups.flatMap((g) =>
    g.sort((a, b) =>
      (terminals[a] as any).name.localeCompare((terminals[b] as any).name, undefined, {sensitivity: 'base'}),
    ),
  );
})();

// Build group header spans: consecutive terminals with the same group get merged
function buildGroupHeaders(): Array<{label: string | null; span: number}> {
  const headers: Array<{label: string | null; span: number}> = [];
  for (const id of terminalIds) {
    const group = (terminals[id] as any).group || null;
    const last = headers[headers.length - 1];
    if (last && last.label === group) {
      last.span++;
    } else {
      headers.push({label: group, span: 1});
    }
  }
  return headers;
}

const groupHeaders = buildGroupHeaders();
const hasGroups = groupHeaders.some((h) => h.label !== null);

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

function isSupported(support: SupportEntry): boolean {
  if (support.partial_implementation) return true;
  return support.version_added === true || typeof support.version_added === 'string';
}

const terminalCounts: Record<string, number> = {};
for (const id of terminalIds) terminalCounts[id] = 0;
for (const category of categories) {
  for (const [key, feature] of Object.entries(category)) {
    if (key === '__meta') continue;
    const compat = (feature as any).__compat;
    for (const termId of terminalIds) {
      if (isSupported(compat.support[termId])) {
        terminalCounts[termId]++;
      }
    }
  }
}

function SupportCell({support}: {support: SupportEntry}) {
  const {version_added, partial_implementation, notes} = support;

  if (partial_implementation) {
    return (
      <td className={styles.partial} title={notes}>
        ~
      </td>
    );
  }

  if (version_added === true || typeof version_added === 'string') {
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

function classifySupport(support: SupportEntry) {
  if (support.partial_implementation) return 'partial';
  if (support.version_added === true || typeof support.version_added === 'string') return 'yes';
  if (support.version_added === false) return 'no';
  return 'unknown';
}

function FeatureCard({featureId, feature}: {featureId: string; feature: any}) {
  const compat = feature.__compat;
  const groups: Record<string, Array<{name: string; notes?: string}>> = {
    yes: [],
    partial: [],
    no: [],
    unknown: [],
  };

  for (const termId of terminalIds) {
    const support = compat.support[termId];
    const kind = classifySupport(support);
    groups[kind].push({name: (terminals[termId] as any).name, notes: support.notes});
  }

  const supportedCount = groups.yes.length + groups.partial.length;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Link to={compat.doc_path} className={styles.cardTitle}>
          {compat.title}
        </Link>
        <span className={styles.cardCount}>
          {supportedCount}/{terminalIds.length}
        </span>
      </div>
      {compat.description && (
        <p className={styles.cardDesc}>{compat.description}</p>
      )}
      <div className={styles.cardSupport}>
        {groups.yes.length > 0 && (
          <div className={styles.cardGroup}>
            <span className={`${styles.cardGroupIcon} ${styles.cardYes}`}>&#x2713;</span>
            <span>{groups.yes.map((t) => t.name).join(', ')}</span>
          </div>
        )}
        {groups.partial.length > 0 && (
          <div className={styles.cardGroup}>
            <span className={`${styles.cardGroupIcon} ${styles.cardPartial}`}>~</span>
            <span>{groups.partial.map((t) => t.name).join(', ')}</span>
          </div>
        )}
        {groups.no.length > 0 && (
          <div className={styles.cardGroup}>
            <span className={`${styles.cardGroupIcon} ${styles.cardNo}`}>&#x2717;</span>
            <span>{groups.no.map((t) => t.name).join(', ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CompatibilityMatrix(): React.ReactElement {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const theadRef = React.useRef<HTMLTableSectionElement>(null);
  const groupRowRef = React.useRef<HTMLTableRowElement>(null);

  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const thead = theadRef.current;
    const groupRow = groupRowRef.current;
    if (!wrapper || !thead) return;

    const update = () => {
      wrapper.style.setProperty('--header-height', `${thead.offsetHeight}px`);
      if (groupRow) {
        wrapper.style.setProperty('--group-row-height', `${groupRow.offsetHeight}px`);
      }
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(thead);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={wrapperRef} className={styles.wrapper}>
        <table className={styles.matrix}>
          <thead ref={theadRef}>
            {hasGroups && (
              <tr ref={groupRowRef} className={styles.groupRow}>
                <th className={styles.featureHeader} colSpan={2} />
                {groupHeaders.map((h, i) =>
                  h.label ? (
                    <th key={i} colSpan={h.span} className={styles.groupHeader}>
                      {h.label}
                    </th>
                  ) : (
                    Array.from({length: h.span}, (_, j) => (
                      <th key={`${i}-${j}`} className={styles.groupHeaderEmpty} />
                    ))
                  ),
                )}
              </tr>
            )}
            <tr>
              <th className={`${styles.featureHeader} ${styles.featureHeaderNames}`}>Feature</th>
              <th className={`${styles.countHeader} ${styles.featureHeaderNames}`}></th>
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
            <tr className={styles.summaryRow}>
              <td className={styles.featureCell}>Features supported</td>
              <td className={styles.countCell}></td>
              {terminalIds.map((id) => (
                <td key={id} className={styles.summaryCell}>
                  {terminalCounts[id]}
                </td>
              ))}
            </tr>
            {categories.map((category) => {
              const meta = category.__meta;
              const features = Object.entries(category).filter(
                ([key]) => key !== '__meta',
              );

              return (
                <React.Fragment key={meta.category}>
                  <tr className={styles.categoryRow}>
                    <td className={styles.categoryCell}>
                      {meta.category}
                    </td>
                    <td colSpan={terminalIds.length + 1} className={styles.categoryFill} />
                  </tr>
                  {features.map(([featureId, feature]) => {
                    const compat = (feature as any).__compat;
                    return (
                      <tr key={featureId}>
                        <td className={styles.featureCell}>
                          <Link to={compat.doc_path}>{compat.title}</Link>
                          <span className={styles.featureDesc}>{compat.description}</span>
                        </td>
                        <td className={styles.countCell}>
                          {terminalIds.filter((id) => isSupported(compat.support[id])).length}
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
      <div className={styles.cardView}>
        {categories.map((category) => {
          const meta = category.__meta;
          const features = Object.entries(category).filter(
            ([key]) => key !== '__meta',
          );
          return (
            <div key={meta.category}>
              <h2 className={styles.cardCategoryTitle}>{meta.category}</h2>
              {features.map(([featureId, feature]) => (
                <FeatureCard key={featureId} featureId={featureId} feature={feature} />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
