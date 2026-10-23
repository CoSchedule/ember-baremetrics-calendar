'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    // The render modifiers keep the existing setup timing that consumers rely on.
    'no-at-ember-render-modifiers': 'off',
  },
};
