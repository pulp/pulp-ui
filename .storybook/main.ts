import type { StorybookConfig } from '@storybook/react-webpack5';

import { dirname } from "path"

import { fileURLToPath } from "url"

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use Yarn PnP or are set up within a monorepo.
*/
function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc')
  ],
  "framework": getAbsolutePath('@storybook/react-webpack5'),
  webpackFinal: async (config) => {
    config.module = config.module ?? { rules: [] };
    config.module.rules = config.module.rules ?? [];
    // .css is already handled by Storybook's implicit CSS loader detection.
    // Only .scss/.sass need a rule added here, since nothing else provides one.
    config.module.rules.push({
      test: /\.(scss|sass)$/,
      exclude: /\.css$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });
    return config;
  },
};
export default config;