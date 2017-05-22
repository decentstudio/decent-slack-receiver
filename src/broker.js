import * as amqplib from 'amqplib'
import * as log from 'npmlog'

let getConnectionUrl = ({user, pass, host, port, vhost}) => {
  return `amqp://${user}:${pass}@${host}:${port}${vhost}`;
};

let getLogUrl = ({user, host, port, vhost}) => {
  return `amqp://${user}:*****@${host}:${port}${vhost}`;
}

let logConnectionAttempt = (config) => {
  let logUrl = getLogUrl(config),
      template = `Connecting to the broker @ ${logUrl}`;
  log.info('broker', template);
  return config;
}

export function getConnection (config) {
  return amqplib.connect(getConnectionUrl(logConnectionAttempt(config)));
}
