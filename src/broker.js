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

function publish (channel, exchange, routingKey, payload, options) {
 return channel.publish(exchange, routingKey, payload, options);
}

export function connect () {
  return new Promise((resolve, reject) => {
    let config = {host: process.env.RABBITMQ_HOST,
                  port: process.env.RABBITMQ_PORT,
		  user: process.env.RABBITMQ_USER,
		  pass: process.env.RABBITMQ_PASS,
		  vhost: process.env.RABBITMQ_VHOST};

     amqplib.connect(getConnectionUrl(logConnectionAttempt(config))).then(
       (conn) => {
         return conn.createChannel();
       }).then((channel) => {
           resolve({publish: publish.bind(null, channel, 'amq.topic')});
       });
  });
}
