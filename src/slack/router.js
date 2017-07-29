import express from 'express';
import log from 'npmlog';
import config from '../config';
import bodyParser from 'body-parser';
import rp from 'request-promise';
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

router.get('/authorize', handleAuthorization);

function handleAuthorization(req, res) {
  log.info(logPrefix, 'A team is installing the app.');
  if (req.query.code) {
    getAuthorizationGrant(req)
      .then((authGrant) => {
        return Promise.all([
          publishAuthGrantToExchange({ authGrant, broker: req.broker }),
          startBotListening({ authGrant, broker: req.broker })
        ])
      })
      .then(() => res.sendStatus(200));
  } else {
    res.status(400);
    res.send('code not included in query string');
  }
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
  return rp.post(postConfig);
}

function publishAuthGrantToExchange({ authGrant, broker }) {
  broker.publish('slack.auth.grant', authGrant);
  return Promise.resolve({ authGrant, broker });
}

function startBotListening({ authGrant, broker }) {
  bot.startListening({ authGrant, broker });
  return Promise.resolve();
}

export default router;
