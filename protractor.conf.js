// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    // './e2e/**/*.e2e-spec.ts'
    './e2e/**/endtoend.e2e-spec.ts'
  ],
  capabilities: {
   'browserName': 'chrome'
  //  'browserName': 'phantomjs',
  //  'phantomjs.binary.path': 'node_modules/phantomjs/lib/phantom/bin/phantomjs'
  },
  directConnect: true,
  // seleniumAddress : 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:4200/',
  // baseUrl: 'http://qa.concreet.com/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    // defaultTimeoutInterval: 10000,
    defaultTimeoutInterval: 650000,
    print: function() {}
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e'
    });
  },
  onPrepare: function() {
    jasmine.getEnv().addReporter(new SpecReporter());
  }
};
