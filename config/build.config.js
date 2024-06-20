const webpackBase = require('./shared.config');

// Compile configuration for stnadalone mode
module.exports = webpackBase({
  API_BASE_PATH: '/api/galaxy/',
  UI_BASE_PATH: '/ui/',
  UI_USE_HTTPS: false,
  WEBPACK_PUBLIC_PATH: '/static/galaxy_ng/',
});
