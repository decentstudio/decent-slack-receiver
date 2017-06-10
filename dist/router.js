'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var express = _interopRequireWildcard(_express);

var _npmlog = require('npmlog');

var log = _interopRequireWildcard(_npmlog);

var _config = require('./config');

var config = _interopRequireWildcard(_config);

var _bodyParser = require('body-parser');

var bodyParser = _interopRequireWildcard(_bodyParser);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = express.Router(),
    slackVerificationToken = config.SLACK_VERIFICATION_TOKEN,
    wrapParseUrlEncodedBody = bodyParser.urlencoded({ extended: true }),
    wrapParseJsonBody = bodyParser.json();

//////////////////////////
// Universal Middleware //
//////////////////////////

function wrapLogRequestBody(req, res, next) {
  log.info('router', req.body);
  return;
}

function wrapAuthorizeSlack(req, res, next) {
  if (req.body.token === slackVerificationToken) {
    next();
    return;
  }
  res.status(400).send('Access denied.');
}

router.all('*', wrapParseJsonBody, wrapParseUrlEncodedBody, wrapLogRequestBody);

////////////
// Events //
////////////

function wrapVerifyEndpoint(req, res, next) {
  if (req.body.type !== 'url_verification') {
    next();
    return;
  }
  res.send(req.body.challenge);
}

function eventHandler(req, res) {
  req.broker.publish('slack.event.' + req.body.event.type, req.body);
  res.status(200).end();
}

router.post('/event', wrapVerifyEndpoint, eventHandler);

//////////////
// Commands //
//////////////

function commandHandler(req, res) {
  req.broker.publish('slack.command', req.body);
  res.status(200);
  res.json({
    'response_type': 'ephemeral',
    'text': 'Command received! One moment...'
  });
}

router.post('/command', commandHandler);

exports.default = router;