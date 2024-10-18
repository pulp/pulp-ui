const webpackBase = require('./shared.config');

module.exports = webpackBase({
  WEBPACK_PUBLIC_PATH: '/static/pulp_ui/',
});
