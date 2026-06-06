'use strict';

module.exports = {
  Platform: {
    OS: 'android',
    select: (spec) => spec.android ?? spec.default,
  },
  TurboModuleRegistry: {
    get: jest.fn(() => null),
    getEnforcing: jest.fn(() => ({})),
  },
  NativeModules: {},
};
