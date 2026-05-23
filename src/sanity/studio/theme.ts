import { buildLegacyTheme } from 'sanity'

export const studioTheme = buildLegacyTheme({
  '--black': '#0A0A0A',
  '--white': '#FAFAFA',
  '--gray': '#525252',
  '--gray-base': '#525252',

  '--component-bg': '#141414',
  '--component-text-color': '#FAFAFA',

  '--brand-primary': '#10B981',

  '--default-button-color': '#262626',
  '--default-button-primary-color': '#10B981',
  '--default-button-success-color': '#10B981',
  '--default-button-warning-color': '#F59E0B',
  '--default-button-danger-color': '#EF4444',

  '--state-info-color': '#3B82F6',
  '--state-success-color': '#10B981',
  '--state-warning-color': '#F59E0B',
  '--state-danger-color': '#EF4444',

  '--main-navigation-color': '#0A0A0A',
  '--main-navigation-color--inverted': '#FAFAFA',

  '--focus-color': '#10B981',
})
