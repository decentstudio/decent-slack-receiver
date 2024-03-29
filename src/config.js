require('dotenv').config();

let get = function (varName) {
  return process.env[varName];
}

const config = {
  HTTP_PORT: get('HTTP_PORT'),
  SLACK_CLIENT_ID: get('SLACK_CLIENT_ID'),
  SLACK_CLIENT_SECRET: get('SLACK_CLIENT_SECRET'),
  SLACK_VERIFICATION_TOKEN: get('SLACK_VERIFICATION_TOKEN')
}

export default config;
