'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    autoImport: {
      // The host app ships one global jQuery (with its plugins) as the AMD
      // `jquery` module, so leave the import to loader.js instead of bundling
      // a second copy.
      exclude: ['jquery'],
    },
  },

  included(appOrAddon) {
    this._super.included.apply(this, arguments);
    const app = appOrAddon.app || appOrAddon;
    const options = app.options.baremetricsCalendar || {};

    if (options.includeStyles !== false) {
      app.import('node_modules/BaremetricsCalendar/public/css/application.css');
    }
  },
};
