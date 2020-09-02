/* eslint-env node */
'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    autoImport: {
      alias: {
        'BaremetricsCalendar': 'BaremetricsCalendar/public/js/Calendar.js'
      },
      // webpack: {
      //   externals: {
      //     moment: 'moment'
      //   }
      // }
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
