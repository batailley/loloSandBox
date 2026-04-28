import uiPreset from '@lolo/ui/tailwind-preset';
import type { Config } from 'tailwindcss';

const config: Config = {
  presets: [uiPreset as Config],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // Important : inclure le source du kit UI pour que Tailwind voie ses classes
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
};

export default config;
