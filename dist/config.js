'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config();

var get = function get(varName) {
  return process.env[varName];
};

var config = {
  HTTP_PORT: get('HTTP_PORT'),
  SLACK_CLIENT_ID: get('SLACK_CLIENT_ID'),
  SLACK_CLIENT_SECRET: get('SLACK_CLIENT_SECRET')
};

exports.default = config;