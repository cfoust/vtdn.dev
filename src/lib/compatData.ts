import terminals from '../../data/terminals.json';
import c0Controls from '../../data/c0-controls.json';
import escapeSequences from '../../data/escape-sequences.json';
import csiSequences from '../../data/csi-sequences.json';
import textStyling from '../../data/text-styling.json';
import oscSequences from '../../data/osc-sequences.json';
import dcsSequences from '../../data/dcs-sequences.json';
import decsetModes from '../../data/decset-modes.json';
import keyboardInput from '../../data/keyboard-input.json';
import graphics from '../../data/graphics.json';
import windowManipulation from '../../data/window-manipulation.json';

export type SupportEntry = {
  version_added: string | boolean | null;
  partial_implementation?: boolean;
  notes?: string;
  last_scanned?: string;
};

export type SpecRef = {
  name: string;
  url: string;
  section?: string;
};

export type CompatEntry = {
  title: string;
  description: string;
  spec_refs?: SpecRef[];
  doc_path: string;
  support: Record<string, SupportEntry>;
};

export type FeatureEntry = {
  __compat: CompatEntry;
};

export type CategoryData = {
  __meta: { category: string };
  [featureId: string]: FeatureEntry | { category: string };
};

export { terminals };

export const dataFiles: Record<string, CategoryData> = {
  'c0-controls': c0Controls.c0_controls as unknown as CategoryData,
  'escape-sequences': escapeSequences.escape_sequences as unknown as CategoryData,
  'csi-sequences': csiSequences.csi_sequences as unknown as CategoryData,
  'text-styling': textStyling.text_styling as unknown as CategoryData,
  'osc-sequences': oscSequences.osc_sequences as unknown as CategoryData,
  'dcs-sequences': dcsSequences.dcs_sequences as unknown as CategoryData,
  'decset-modes': decsetModes.decset_modes as unknown as CategoryData,
  'keyboard-input': keyboardInput.keyboard_input as unknown as CategoryData,
  graphics: graphics.graphics as unknown as CategoryData,
  'window-manipulation': windowManipulation.window_manipulation as unknown as CategoryData,
};

export const categories: CategoryData[] = Object.values(dataFiles);

export function classifySupport(support: SupportEntry): 'yes' | 'partial' | 'no' | 'unknown' {
  if (support.partial_implementation) return 'partial';
  if (support.version_added === true || typeof support.version_added === 'string') return 'yes';
  if (support.version_added === false) return 'no';
  return 'unknown';
}

export function isSupported(support: SupportEntry): boolean {
  if (support.partial_implementation) return true;
  return support.version_added === true || typeof support.version_added === 'string';
}

// Sort terminals alphabetically by name within each group, preserving group order
export const terminalIds: string[] = (() => {
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

export type GroupHeader = { label: string | null; span: number };

export function buildGroupHeaders(): GroupHeader[] {
  const headers: GroupHeader[] = [];
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

export function getFeature(dataFileKey: string, featureId: string): FeatureEntry | undefined {
  const category = dataFiles[dataFileKey];
  if (!category) return undefined;
  const entry = category[featureId];
  if (!entry || !('__compat' in entry)) return undefined;
  return entry as FeatureEntry;
}
