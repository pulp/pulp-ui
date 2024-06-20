const webpackBase = require('./shared.config');

// Used for getting the correct host when running in a container
const proxyHost = process.env.API_PROXY_HOST || 'localhost';
const proxyPort = process.env.API_PROXY_PORT || '8080';
const apiBasePath = process.env.API_BASE_PATH || '/pulp/api/v3';
const proxyTarget = `http://${proxyHost}:${proxyPort}`;

module.exports = webpackBase({
  // The host where the API lives. EX: http://localhost:8080
  API_HOST: '',

  // Path to the API on the API host. EX: /pulp/api/v3
  API_BASE_PATH: apiBasePath,

  // Path on the host where the UI is found. EX: /ui/
  UI_BASE_PATH: '/ui/',

  // Port that the UI is served over.
  UI_PORT: 8002,

  // Serve the UI over http or https. Options: true, false
  UI_USE_HTTPS: false,

  // Value for webpack.devServer.proxy
  // https://webpack.js.org/configuration/dev-server/#devserverproxy
  // used to get around CORS requirements when running in dev mode
  WEBPACK_PROXY: {
    '/api/': proxyTarget,
    '/assets/': proxyTarget,
    '/extensions/': proxyTarget,
    '/pulp/': proxyTarget,
    '/static/rest_framework/': proxyTarget,
    '/v2/': proxyTarget,
  },
});
