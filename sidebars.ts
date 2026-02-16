import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  standardsSidebar: [
    {
      type: 'category',
      label: 'Control Sequences',
      items: [
        'c0-c1-controls',
        'csi-sequences',
        'sgr-attributes',
        'osc-sequences',
        'dcs-sequences',
        'decset-modes',
      ],
    },
    {
      type: 'category',
      label: 'Modern Protocols',
      items: [
        'kitty-keyboard-protocol',
        'graphics-protocols',
        'advanced-modes',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'iso-2022-charsets',
        'window-manipulation',
        'unicode-text-rendering',
        'security',
        'multiplexers-shell-integration',
        'platform-integration',
      ],
    },
  ],
};

export default sidebars;
