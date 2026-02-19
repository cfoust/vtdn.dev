import React from 'react';

type Spec = {
  name: string;
  url: string;
  section?: string;
};

export default function SpecificationsTable({specs}: {specs: Spec[]}) {
  if (!specs || specs.length === 0) return null;

  return (
    <table>
      <thead>
        <tr>
          <th>Specification</th>
          <th>Section</th>
        </tr>
      </thead>
      <tbody>
        {specs.map((spec) => (
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
