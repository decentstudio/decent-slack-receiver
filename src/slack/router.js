import express from 'express';
import log from 'npmlog';
import config from '../config';
import bodyParser from 'body-parser';
import request from 'request';
import bot from './bot';

const router = express.Router(),
  slackVerificationToken = config.SLACK_VERIFICATION_TOKEN,
  wrapParseUrlEncodedBody = bodyParser.urlencoded({ extended: true }),
  wrapParseJsonBody = bodyParser.json(),
  logPrefix = 'Slack Router:';

/*
  Slack universal middleware
*/

function wrapLogRequestBody(req, res, next) {
  log.info(logPrefix, req.body);
  next();
}

router.use(
  wrapParseJsonBody,
  wrapParseUrlEncodedBody,
  wrapLogRequestBody
);

////////////
// Events //
////////////

function wrapAuthorizeSlack(req, res, next) {
  if (req.body.token === slackVerificationToken) {
    next();
    return;
  }
  log.info(logPrefix, 'Verification token invalid. Sending 400 Access denied.');
  res.status(400).send('Access denied.');
}

function wrapVerifyEndpoint(req, res, next) {
  if (req.body.type !== 'url_verification') {
    next();
    return;
  }
  res.send(req.body.challenge);
}

function eventHandler(req, res) {
  req.broker.publish(`slack.event.${req.body.event.type}`, req.body);
  res.sendStatus(200);
}

router.post('/event',
  wrapVerifyEndpoint,
  wrapAuthorizeSlack,
  eventHandler);

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

////////////////////////////////////////////////////
// Authorization When Teams Install the Slack App //
////////////////////////////////////////////////////

function authorizationGrantHandler(broker, error, response, body) {
  if (error) {
    log.error(logPrefix, error);
  }
  const bodyObject = JSON.parse(body);
  log.info(logPrefix, `A team called ${bodyObject.team_name} just installed the app.`);
  // Do the things we want to do when a team initially installs our app
  bot.startListening(bodyObject.bot.bot_access_token, bodyObject.team_name, broker);
}

function getAuthorizationGrant(req) {
  log.info(logPrefix, 'Getting authorization grant.');
  const postConfig = {
    url: 'https://slack.com/api/oauth.access',
    form: {
      client_id: config.SLACK_CLIENT_ID,
      client_secret: config.SLACK_CLIENT_SECRET,
      code: req.query.code
    }
  };
  request.post(postConfig, authorizationGrantHandler.bind(null, req.broker));
}

function authorizationHandler(req, res) {
  log.info(logPrefix, 'A team is installing the app.');
  if (req.query.code) {
    getAuthorizationGrant(req);
    res.sendStatus(200);
  } else {
    res.status(400);
    res.send('code not included in query string');
  }
}

router.get('/authorize', authorizationHandler);

export default router;
