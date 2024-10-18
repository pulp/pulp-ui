const { resolve } = require('node:path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { execSync } = require('node:child_process');
const webpack = require('webpack');

// NOTE: This file is not meant to be consumed directly by weback. Instead it
// should be imported, initialized with the following settings and exported like
// a normal webpack config. See config/start.config.js for an example

const isBuild = process.env.NODE_ENV === 'production';

// only run git when PULP_UI_COMMIT is NOT provided
const buildInfo = {
  hash:
    process.env.PULP_UI_COMMIT ||
    execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim(),
  date: execSync('date -I', { encoding: 'utf-8' }).trim(),
  version: require('../package.json').version,
};

const appName = 'Pulp UI';
const docsURL = 'https://docs.pulpproject.org/';

// Default user defined settings
const defaultConfigs = [
  // scope = webpack | browser | both
  // webpack: will only be available to webpack config, via `customConfigs`
  // browser: will only be available in the browser, as DefinePlugin constants
  // both: means both
  { name: 'APPLICATION_NAME', default: appName, scope: 'both' },

  { name: 'UI_BUILD_INFO', default: buildInfo, scope: 'browser' },
  { name: 'UI_DOCS_URL', default: docsURL, scope: 'browser' },

  { name: 'DEV_PORT', scope: 'webpack' },
  { name: 'DEV_HTTPS', scope: 'webpack' },
  { name: 'DEV_PROXY', scope: 'webpack' },
  { name: 'WEBPACK_PUBLIC_PATH', scope: 'webpack' },
];

module.exports = (inputConfigs) => {
  const customConfigs = {};
  const globals = {};

  defaultConfigs
    .filter(({ scope }) => ['both', 'webpack'].includes(scope))
    .forEach((item) => {
      customConfigs[item.name] = inputConfigs[item.name] ?? item.default;
    });

  defaultConfigs
    .filter(({ scope }) => ['both', 'browser'].includes(scope))
    .forEach((item) => {
      globals[item.name] = JSON.stringify(
        inputConfigs[item.name] ?? item.default,
      );
    });

  return {
    devtool: 'source-map',

    ...(isBuild
      ? {}
      : {
          devServer: {
            allowedHosts: 'all',
            client: { overlay: false },
            devMiddleware: { writeToDisk: true },
            historyApiFallback: true,
            host: '0.0.0.0',
            hot: false,
            liveReload: true,
            onListening: ({ options: { https, port } }) =>
              console.log(
                'App should run on:',
                `${https ? 'https' : 'http'}://localhost:${port}`,
              ),
            port: customConfigs.DEV_PORT,
            proxy: Object.entries(customConfigs.DEV_PROXY).map(
              ([path, target]) => ({
                context: [path],
                target,
              }),
            ),
            server: { type: customConfigs.DEV_HTTPS ? 'https' : 'http' },
            static: { directory: resolve(__dirname, '../dist') },
          },
        }),

    entry: { App: resolve(__dirname, '../src/entrypoint.tsx') },
    mode: isBuild ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /src\/.*\.(js|jsx|ts|tsx)$/,
          use: [{ loader: 'source-map-loader' }, { loader: 'babel-loader' }],
        },
        {
          test: /\.(css|scss|sass)$/,
          use: [
            isBuild ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.(woff(2)?|ttf|jpg|png|eot|gif|svg)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          generator: { filename: 'fonts/[name][ext][query]' },
        },
        { test: /\.mjs$/, include: /node_modules/, type: 'javascript/auto' },
      ],
    },
    output: {
      filename: 'js/[name].[fullhash].js',
      path: resolve(__dirname, '../dist'),
      publicPath: customConfigs.WEBPACK_PUBLIC_PATH ?? '/',
      chunkFilename: 'js/[name].[fullhash].js',
    },
    plugins: [
      // sourcemaps
      new webpack.SourceMapDevToolPlugin({
        exclude: /node_modules/,
        filename: 'sourcemaps/[name].[contenthash].js.map',
      }),
      // extract css in prod
      isBuild &&
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash].css',
        }),
      // clean dist/
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['**/*', '!index.html'],
      }),
      // define global vars
      new webpack.DefinePlugin(globals),
      // typescript check
      new ForkTsCheckerWebpackPlugin(),
      // inject src/index.html
      new HtmlWebpackPlugin({
        applicationName: customConfigs.APPLICATION_NAME,
        favicon: 'static/images/favicon.ico',
        template: resolve(__dirname, '../src/index.html'),
      }),
      // copy pulp-ui-config.json
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolve(__dirname, '../pulp-ui-config.json'),
            to: 'pulp-ui-config.json',
          },
        ],
      }),
    ].filter(Boolean),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        // imports relative to repo root
        src: resolve(__dirname, '../src'),
        static: resolve(__dirname, '../static'),
      },
    },
    watchOptions: {
      // ignore editor files when watching
      ignored: ['**/.*.sw[po]'],
    },
  };
};
