'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    autoImport: {
      exclude: ['jquery'],
    },
  });

  // Provide jQuery the way the CoSchedule web app does: one vendor.js global
  // that loader.js serves as the `jquery` module. jQuery's own named AMD
  // define rules out ember-cli's `amd` transformation, hence the shim.
  app.import('node_modules/jquery/dist/jquery.js', { prepend: true });
  app.import('vendor/dummy/jquery-shim.js');

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
