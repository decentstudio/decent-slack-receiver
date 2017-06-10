'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _broker = require('./broker');

var broker = _interopRequireWildcard(_broker);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _npmlog = require('npmlog');

var _npmlog2 = _interopRequireDefault(_npmlog);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _client = require('@slack/client');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var app = (0, _express2.default)();

app.get('/authorize', function (req, res) {
  getAuthorizationGrant(req.query.code);
});

app.listen(_config2.default.HTTP_PORT, function (app, err) {
  onStart(_config2.default.HTTP_PORT, app, err);
});

function getAuthorizationGrant(code) {
  console.log('Getting authorization grant.');
  var postConfig = {
    url: 'https://slack.com/api/oauth.access',
    form: {
      client_id: _config2.default.SLACK_CLIENT_ID,
      client_secret: _config2.default.SLACK_CLIENT_SECRET,
      code: code
    }
  };
  _request2.default.post(postConfig, function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode);
    var bodyObject = JSON.parse(body);
    console.log('body:', bodyObject);
    startBotListening(bodyObject.bot.bot_access_token);
  });
}

function startBotListening(botAccessToken) {
  console.log('Bot access token:', botAccessToken);
  var rtm = new _client.RtmClient(botAccessToken);
  rtm.on(_client.RTM_EVENTS.MESSAGE, handleRtmMessage);
  rtm.start();
}

function handleRtmMessage(message) {
  console.log('Message:', message);
}

function onStart(port, app, err) {
  if (!err) {
    var template = 'Magic happens on port ' + port;
    _npmlog2.default.info('server', template);
  } else {
    _npmlog2.default.error('server', err);
  }
}