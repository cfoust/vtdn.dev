import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {getFeature, type SpecRef} from '../../lib/compatData';

export default function SpecificationsTable({specs}: {specs?: SpecRef[]}) {
  const {frontMatter} = useDoc();
  const fm = frontMatter as any;

  // Use explicit props if provided, otherwise look up from data file
  let resolved = specs;
  if (!resolved && fm.feature_id && fm.data_file) {
    const feature = getFeature(fm.data_file, fm.feature_id);
    resolved = feature?.__compat?.spec_refs;
  }

  if (!resolved || resolved.length === 0) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>Specification</th>
          <th>Section</th>
        </tr>
      </thead>
      <tbody>
        {resolved.map((spec) => (
          <tr key={spec.url}>
            <td>
              <a href={spec.url} target="_blank" rel="noopener noreferrer">
                {spec.name}
              </a>
            </td>
            <td>{spec.section || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
