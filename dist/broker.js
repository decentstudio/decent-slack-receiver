'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;

var _amqplib = require('amqplib');

var amqplib = _interopRequireWildcard(_amqplib);

var _npmlog = require('npmlog');

var log = _interopRequireWildcard(_npmlog);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var getConnectionUrl = function getConnectionUrl(_ref) {
  var user = _ref.user,
      pass = _ref.pass,
      host = _ref.host,
      port = _ref.port,
      vhost = _ref.vhost;

  return 'amqp://' + user + ':' + pass + '@' + host + ':' + port + vhost;
};

var getLogUrl = function getLogUrl(_ref2) {
  var user = _ref2.user,
      host = _ref2.host,
      port = _ref2.port,
      vhost = _ref2.vhost;

  return 'amqp://' + user + ':*****@' + host + ':' + port + vhost;
};

var logConnectionAttempt = function logConnectionAttempt(config) {
  var logUrl = getLogUrl(config),
      template = 'Connecting to the broker @ ' + logUrl;
  log.info('broker', template);
  return config;
};

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
  var bufferedPayload = Buffer.from(JSON.stringify(payload));
  return channel.publish(exchange, routingKey, bufferedPayload, options);
}

function connect() {
  return new Promise(function (resolve, reject) {
    var config = { host: process.env.RABBITMQ_HOST,
      port: process.env.RABBITMQ_PORT,
      user: process.env.RABBITMQ_USER,
      pass: process.env.RABBITMQ_PASS,
      vhost: process.env.RABBITMQ_VHOST };

    amqplib.connect(getConnectionUrl(logConnectionAttempt(config))).then(function (conn) {
      return conn.createChannel();
    }).then(function (channel) {
      resolve({ publish: publish.bind(null, channel, 'amq.topic') });
    });
  });
}