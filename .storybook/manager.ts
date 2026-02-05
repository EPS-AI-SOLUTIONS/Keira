import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

// Custom Keira Theme
const keiraTheme = create({
  base: 'dark',

  // Brand
  brandTitle: 'Keira Watermark Remover',
  brandUrl: 'https://github.com/pawelserkowski/keira',
  brandTarget: '_blank',

  // Colors
  colorPrimary: '#00ff41',
  colorSecondary: '#00ff41',

  // UI
  appBg: '#0a1f0a',
  appContentBg: '#0d1f0d',
  appPreviewBg: '#0a1f0a',
  appBorderColor: '#1a3a1a',
  appBorderRadius: 8,

  // Text colors
  textColor: '#e2e8f0',
  textInverseColor: '#0a0a0a',
  textMutedColor: '#94a3b8',

  // Toolbar
  barTextColor: '#94a3b8',
  barSelectedColor: '#00ff41',
  barHoverColor: '#00ff41',
  barBg: '#0a1f0a',

  // Forms
  inputBg: '#0d1f0d',
  inputBorder: '#1a3a1a',
  inputTextColor: '#e2e8f0',
  inputBorderRadius: 6,

  // Buttons
  buttonBg: '#00ff41',
  buttonBorder: 'transparent',

  // Boolean inputs
  booleanBg: '#1a3a1a',
  booleanSelectedBg: '#00ff41',

  // Typography
  fontBase: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
});

// Addon configuration
addons.setConfig({
  theme: keiraTheme,

  sidebar: {
    showRoots: true,
    collapsedRoots: ['other'],
    renderLabel: ({ name, type }) => {
      if (type === 'component') {
        return `📦 ${name}`;
      }
      if (type === 'group') {
        return `📁 ${name}`;
      }
      return name;
    },
  },

  panelPosition: 'bottom',
  enableShortcuts: true,
  showToolbar: true,
  initialActive: 'canvas',
  navSize: 300,
  bottomPanelHeight: 300,
  rightPanelWidth: 400,
  selectedPanel: 'controls',
});
