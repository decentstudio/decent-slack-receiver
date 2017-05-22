require('dotenv').config();

let get = function (varName) {
  return process.env[varName];
}

export const HTTP_PORT = get('HTTP_PORT'),
             SLACK_VERIFICATION_TOKEN = get('SLACK_VERIFICATION_TOKEN'),
             RABBITMQ_HOST = get('RABBITMQ_HOST'),
             RABBITMQ_PORT = get('RABBITMQ_PORT'),
             RABBITMQ_USER = get('RABBITMQ_USER'),
             RABBITMQ_PASS = get('RABBITMQ_PASS'),
             RABBITMQ_VHOST = get('RABBITMQ_VHOST');
