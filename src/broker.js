import amqplib from 'amqplib'
import log from 'npmlog'

function getConnectionUrl({ user, pass, host, port, vhost }) {
  return `amqp://${user}:${pass}@${host}:${port}${vhost}`;
};

function getLogUrl({ user, host, port, vhost }) {
  return `amqp://${user}:*****@${host}:${port}${vhost}`;
}

function logConnectionAttempt(config) {
  let logUrl = getLogUrl(config),
    template = `Connecting to the broker @ ${logUrl}`;
  log.info('broker', template);
  return config;
}

/* 
* This function publishes a message to an AMQP broker.
*
* `channel`: An AMQP channel object.
* `exchange`: Name of the target exchange as a string.
* `routingKey`: The routing key for the message as a string.
* `payload`: A JavaScript object.
* `options`: An object containing AMQP publish options.
*
*/
function publish(channel, exchange, routingKey, payload, options) {
  let bufferedPayload = Buffer.from(JSON.stringify(payload));
  return channel.publish(exchange, routingKey, bufferedPayload, options);
}

function connect() {
  return new Promise((resolve, reject) => {
    let config = {
      host: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
      user: process.env.RABBITMQ_USER,
      pass: process.env.RABBITMQ_PASS,
      vhost: process.env.RABBITMQ_VHOST
    };

    amqplib.connect(getConnectionUrl(logConnectionAttempt(config))).then(
      (conn) => {
        return conn.createChannel();
      }).then((channel) => {
        resolve({ publish: publish.bind(null, channel, 'amq.topic') });
      });
  });
}

const broker = {
  connect: connect
};

export default broker;
