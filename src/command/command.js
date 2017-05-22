const commandParamsMap = require('./command-params-map');

module.exports = class Command {
  constructor(command, text) {
    this.command = command;
    this.params = text.split(' ');
    this.validate = this.validate.bind(this);
  }

  validate() {
    const paramDefs = commandParamsMap.get(this.command);

    // check if number of params given equals number of required params
    const numRequiredParams = paramDefs.filter((param) => {
      return param.required === true;
    }).length;

    if (this.params.length !== numRequiredParams) {
      return false;
    }

    // validate each command against its definition
    const paramValidations = this.params.map((param, index) => {
      const valid = true;
      
      if (typeof param !== paramDefs[index].type) {
        
      }
    });

    return true;
  }
}