'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = async function () {
  return {
    packageManager: 'npm',
    // ember-cli-htmlbars 7 declares an `ember-source >= 4` peer, but it still
    // compiles 3.28 templates, so the 3.28 install has to skip peer checks.
    // ember-source 3.28 also needs an ember-cli that still has bower APIs.
    buildManagerOptions(dependencySet) {
      const isEmber328 =
        dependencySet?.devDependencies?.['ember-source'] === '~3.28.0';
      return [
        '--no-package-lock',
        ...(isEmber328 ? ['--legacy-peer-deps'] : []),
      ];
    },
    scenarios: [
      {
        name: 'ember-lts-3.28',
        npm: {
          dependencies: {
            '@glimmer/component': '^1.1.2',
          },
          devDependencies: {
            '@ember/test-helpers': '^2.9.4',
            'ember-cli': '~3.28.0',
            'ember-load-initializers': '^2.1.2',
            'ember-qunit': '^6.2.0',
            'ember-resolver': '^8.1.0',
            'ember-source': '~3.28.0',
          },
        },
      },
      {
        name: 'ember-lts-4.12',
        npm: {
          devDependencies: {
            'ember-load-initializers': '^2.1.2',
            'ember-source': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-lts-5.12',
        npm: {
          devDependencies: {
            'ember-source': '~5.12.0',
          },
        },
      },
      {
        name: 'ember-lts-6.12',
        npm: {
          devDependencies: {
            'ember-source': '~6.12.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      },
    ],
  };
};
