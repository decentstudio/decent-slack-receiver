import Jasmine from 'jasmine'
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

var jasmine = new Jasmine()

jasmine.env.clearReporters();               // remove default reporter logs
jasmine.env.addReporter(new SpecReporter({  // add jasmine-spec-reporter
  spec: {
    displayPending: true
  }
}));

jasmine.loadConfigFile('jasmine.json');
jasmine.execute();