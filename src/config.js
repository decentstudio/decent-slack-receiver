require('dotenv').config();

let get = function (varName) {
  return process.env[varName];
}

export const HTTP_PORT = get('HTTP_PORT'),
             SLACK_VERIFICATION_TOKEN = get('SLACK_VERIFICATION_TOKEN');
