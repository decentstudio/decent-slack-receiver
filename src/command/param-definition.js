module.exports = class ParamDefinition {
  constructor(name, type, required) {
    this.name = name;
    this.type = type;
    this.required = required;
  }
}