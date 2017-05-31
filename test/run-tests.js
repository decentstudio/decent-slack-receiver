import Jasmine from 'jasmine'
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

var jasmine = new Jasmine()

jasmine.env.clearReporters();
jasmine.env.addReporter(new SpecReporter({
  spec: {
    displayPending: true
  }
}));

jasmine.loadConfigFile('jasmine.json');
jasmine.execute();